import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { ContextDataService, hasValue, JsonUtils, UniqueIds } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../components/models';
import { CAPTCHA_TOKEN_KEY, QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { TrackError } from '../errors';
import { StorageLib } from '../lib';
import { AppContextData, QuoteControlModel } from '../models';
import { CaptchaService, JourneyService, LiteralsService } from '../services';
import { TrackEventType, TrackInfo, TrackInfoPageModel } from './quote-track.model';
import { _window } from './window-tracker.model';

@Injectable({ providedIn: 'root' })
export class QuoteTrackService implements OnDestroy {
  public trackID = UniqueIds._next_();

  private isMobile?: boolean;
  private referrer?: string;

  private readonly subscription$: Subscription[] = [];

  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly captchaService = inject(CaptchaService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly contextDataService = inject(ContextDataService);
  private readonly literalService = inject(LiteralsService);
  private readonly journeyService = inject(JourneyService);

  constructor() {
    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this.isMobile = state.breakpoints[Breakpoints.HandsetPortrait]))
    );

    this.headData();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub?.unsubscribe?.());
  }

  public trackView = async (inPage: string): Promise<number> =>
    // @howto implemants requestIdleCallback for track event
    requestIdleCallback(async () => {
      {
        const fullUrl = this.fullUrl(inPage);

        const infoPage: TrackInfoPageModel = {
          page: inPage,
          URL: fullUrl,
          referrer: this.referrer,
          user_type: 'web',
          device_type: this.isMobile ? 'mobile' : 'desktop'
        };

        _window.digitalData = { infoPag: infoPage };
        this.referrer = fullUrl;

        await Promise.resolve();
        return this.trackFn('view');
      }
    });

  public trackEvent = async (eventType: TrackEventType, data: TrackInfo): Promise<number> => {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const {
      configuration: { name: journey, steppers },
      navigation: { lastPage, viewedPages }
    } = appContextData;
    const fullUrl = lastPage && this.fullUrl(lastPage.pageId);
    const title = this.literalService.toString({ value: 'header', type: 'literal' });

    return requestIdleCallback(async () => {
      {
        const trackInfo: TrackInfo = {
          ...this.loadManifest(),
          ...Object.entries(data)
            .filter(([, value]) => hasValue(value))
            .reduce<TrackInfo>((acc, [key, value]) => {
              if (
                !(key in this.workFlowToken.manifest.tracks) ||
                this.workFlowToken.manifest.tracks[key as keyof typeof this.workFlowToken.manifest.tracks].tracked
              ) {
                acc[key] = `${value}`;
              }
              return acc;
            }, {}),
          category: `tarificador ${journey}`,
          page: lastPage?.pageId,
          title: title,
          URL: fullUrl
        };

        if (lastPage?.stepper) {
          const stepper = steppers?.[lastPage.stepper.key];
          const stepperPages = stepper?.steps?.flatMap(step => step.pages) ?? [];
          const stepperPagesViewed = viewedPages.filter(page => stepperPages.includes(page));
          const step = stepper?.steps?.find(step => step.key === lastPage.stepper?.stepKey);

          trackInfo['step_name'] = step?.label ? this.literalService.toString(step?.label) : '';
          trackInfo['step_number'] = `${stepperPagesViewed.length}`;
        }

        await Promise.resolve();
        return this.trackFn(eventType, trackInfo);
      }
    });
  };

  private headData = (): void => {
    const digitalData = document.createElement('script');
    digitalData.type = 'text/javascript';
    digitalData.text = 'var digitalData = {};';

    document.head.appendChild(digitalData);
  };

  private loadManifest = (): TrackInfo => {
    const quote = this.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);

    return Object.entries(this.workFlowToken.manifest.tracks).reduce<TrackInfo>((acc, [key, data]) => {
      if (!data.tracked) return acc;

      const value = JsonUtils.get(quote, data.path);
      if (hasValue(value)) acc[key] = `${value}`;

      return acc;
    }, {});
  };

  private trackFn = async (eventType: TrackEventType | 'view', trackInfo?: TrackInfo): Promise<void> => {
    const enableTracking = await this.journeyService.enableTracking();

    if (!enableTracking) {
      return;
    }

    if (!_window._satellite) {
      throw new TrackError('Adobe Launch not found', eventType, trackInfo);
    }

    await this.captchaService
      .execute({ action: eventType })
      .then(async (token: string) => {
        _window.digitalData = { ..._window.digitalData, token };
        StorageLib.set(CAPTCHA_TOKEN_KEY, token);

        await _window._satellite.track(eventType, trackInfo);
      })
      .catch((error: Error) => {
        throw new TrackError(error.message, eventType, trackInfo);
      });
  };

  private fullUrl = (inPage: string): string => `${window.location.protocol}//${window.location.host}/${inPage}`;
}
