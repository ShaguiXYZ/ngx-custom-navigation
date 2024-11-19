import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ContextDataService, deepCopy, hasValue, JsonUtils, UniqueIds } from '@shagui/ng-shagui/core';
import { filter, Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { TrackError } from '../errors';
import { AppContextData, Page, QuoteModel } from '../models';
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
  private readonly router = inject(Router);
  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this.isMobile = state.breakpoints[Breakpoints.HandsetPortrait]))
    );

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const {
        navigation: { lastPage }
      } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      const page = lastPage && Page.routeFrom(lastPage);
      const fullUrl = `${window.location.protocol}//${window.location.host}/${page}`;

      const infoPag: TrackInfoPageModel = {
        pagina: lastPage?.pageId!,
        URL: fullUrl,
        pagina_previa: this.referrer,
        tipo_usuario: 'web',
        tipo_dispositivo: this.isMobile ? 'mobile' : 'desktop'
      };

      this.infoPage = deepCopy(infoPag);

      _window.digitalData = { infoPag };

      this.trackFn('view');
      this.referrer = fullUrl;
    });

    this.headData();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub?.unsubscribe?.());
  }

  public trackEvent = async (eventType: TrackEventType, data: TrackInfo): Promise<number> => {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const {
      navigation: { viewedPages }
    } = appContextData;

    const trackInfo = {
      ...this.loadManifest(),
      ...Object.fromEntries(
        Object.entries(data)
          .filter(([, value]) => hasValue(value))
          .map(([key, value]) => [key, `${value}`])
      ),
      category: 'tarificador',
      pagina: this.infoPage?.pagina,
      URL: this.infoPage?.URL,
      step_number: `${viewedPages.length}`
    };

    await Promise.resolve();
    return this.trackFn(eventType, trackInfo);
  };

  private headData = (): void => {
    const digitalData = document.createElement('script');
    digitalData.type = 'text/javascript';
    digitalData.text = 'var digitalData = {};';

    document.head.appendChild(digitalData);
  };

  private loadManifest = (): TrackInfo => {
    const quote = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    return Object.entries(TRACKING_QUOTE_MANIFEST).reduce<TrackInfo>((acc, [key, value]) => {
      const val = JsonUtils.valueOf(quote, value);
      if (hasValue(val)) acc[key as keyof typeof TRACKING_QUOTE_MANIFEST] = `${val}`;

      return acc;
    }, {});
  };

  private trackFn = (eventType: TrackEventType | 'view', trackInfo?: TrackInfo): number =>
    // @howto implemants requestIdleCallback for track event
    requestIdleCallback(() => {
      if (!_window._satellite) {
        throw new TrackError('Adobe Launch not found', eventType, trackInfo);
      }

      _window._satellite.track(eventType, trackInfo);
    });
}
