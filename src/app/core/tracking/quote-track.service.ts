import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { ContextDataService, deepCopy, hasValue, JsonUtils, UniqueIds } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { TrackError } from '../errors';
import { AppContextData, QuoteModel } from '../models';
import { TrackEventType, TrackInfo, TrackInfoPageModel, TRACKING_QUOTE_MANIFEST } from './quote-track.model';
import { _window } from './window-tracker.model';

@Injectable({ providedIn: 'root' })
export class QuoteTrackService implements OnDestroy {
  public trackID = UniqueIds._next_();

  private isMobile?: boolean;
  private infoPage?: TrackInfoPageModel;
  private referrer?: string;

  private readonly subscription$: Subscription[] = [];
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly contextDataService = inject(ContextDataService);

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
        const fullUrl = `${window.location.protocol}//${window.location.host}/${inPage}`;

        const infoPage: TrackInfoPageModel = {
          page: inPage,
          URL: fullUrl,
          referrer: this.referrer,
          user_type: 'web',
          device_type: this.isMobile ? 'mobile' : 'desktop'
        };

        this.infoPage = deepCopy(infoPage);
        _window.digitalData = { infoPag: infoPage };
        this.referrer = fullUrl;

        await Promise.resolve();
        return this.trackFn('view');
      }
    });

  public trackEvent = async (eventType: TrackEventType, data: TrackInfo): Promise<number> =>
    requestIdleCallback(async () => {
      {
        const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
        const {
          settings: { journey },
          navigation: { viewedPages }
        } = appContextData;

        const trackInfo: TrackInfo = {
          ...this.loadManifest(),
          ...Object.entries(data)
            .filter(([, value]) => hasValue(value))
            .reduce((acc, [key, value]) => {
              if (!(key in TRACKING_QUOTE_MANIFEST) || TRACKING_QUOTE_MANIFEST[key as keyof typeof TRACKING_QUOTE_MANIFEST].tracked) {
                acc[key] = `${value}`;
              }
              return acc;
            }, {} as TrackInfo),
          category: `tarificador ${journey}`,
          page: this.infoPage?.page,
          URL: this.infoPage?.URL,
          step_number: `${viewedPages.length}`
        };

        await Promise.resolve();
        return this.trackFn(eventType, trackInfo);
      }
    });

  private headData = (): void => {
    const digitalData = document.createElement('script');
    digitalData.type = 'text/javascript';
    digitalData.text = 'var digitalData = {};';

    document.head.appendChild(digitalData);
  };

  private loadManifest = (): TrackInfo => {
    const quote = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    return Object.entries(TRACKING_QUOTE_MANIFEST).reduce<TrackInfo>((acc, [key, data]) => {
      if (!data.tracked) return acc;

      const value = JsonUtils.valueOf(quote, data.value);
      if (hasValue(value)) acc[key as keyof typeof TRACKING_QUOTE_MANIFEST] = `${value}`;

      return acc;
    }, {});
  };

  private trackFn = async (eventType: TrackEventType | 'view', trackInfo?: TrackInfo): Promise<void> => {
    if (!_window._satellite) {
      throw new TrackError('Adobe Launch not found', eventType, trackInfo);
    }

    await _window._satellite.track(eventType, trackInfo);
  };
}
