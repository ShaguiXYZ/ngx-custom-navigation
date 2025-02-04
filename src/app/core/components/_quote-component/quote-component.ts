import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy, JsonUtils } from '@shagui/ng-shagui/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DEFAULT_DISPLAY_DATE_FORMAT, QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteControlModel } from 'src/app/core/models';
import { ServiceActivatorService } from '../../service-activators';
import { LanguageService } from '../../services';

@Component({
  template: ''
})
export abstract class QuoteComponent<T extends QuoteControlModel> implements OnDestroy {
  public name?: string;

  protected displayDateFormat = DEFAULT_DISPLAY_DATE_FORMAT;
  protected displayDateFormats: string[] = [DEFAULT_DISPLAY_DATE_FORMAT];
  protected _contextData: T;
  protected subscription$: Subscription[] = [];

  protected ngOnQuoteInit?: () => void;

  protected readonly contextDataService = inject(ContextDataService);

  private readonly _destroyed = new Subject<void>();
  private readonly languageService = inject(LanguageService);
  private readonly serviveActivatorService = inject(ServiceActivatorService);

  constructor() {
    this.serviveActivatorService.activateEntryPoint('on-init');

    this.contextDataService
      .onDataChange<T>(QUOTE_CONTEXT_DATA)
      .pipe(takeUntil(this._destroyed))
      .subscribe(data => (this._contextData = data));
    this._contextData = this.contextDataService.get<T>(QUOTE_CONTEXT_DATA);
    this.__localeConfig();

    Promise.resolve().then(() => this.__updateComponentData(this));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();

    this.subscription$.forEach(subscription => subscription.unsubscribe());

    this.serviveActivatorService.activateEntryPoint('on-destroy');
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private __localeConfig = (): void => {
    this.languageService
      .asObservable()
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => {
        this.displayDateFormat = this.languageService.languages[value].format ?? DEFAULT_DISPLAY_DATE_FORMAT;
        this.displayDateFormats = this.languageService.languages[value].formats ?? [DEFAULT_DISPLAY_DATE_FORMAT];
      });

    this.displayDateFormat = this.languageService.languages[this.languageService.current]?.format ?? DEFAULT_DISPLAY_DATE_FORMAT;
    this.displayDateFormats = this.languageService.languages[this.languageService.current]?.formats ?? [DEFAULT_DISPLAY_DATE_FORMAT];
  };

  private __updateComponentData = <C extends QuoteComponent<T>>(component: C): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageData = lastPage?.configuration?.data ?? {};

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component['_contextData'] === 'object' && typeof value === 'object') {
        component['_contextData'] = JsonUtils.patch(component['_contextData'], value as Record<string, unknown>);
        this.contextDataService.set(QUOTE_CONTEXT_DATA, component['_contextData']);
      } else if (key in component) {
        component[key as keyof C] = deepCopy(value) as C[keyof C];
      }
    }

    this.resetView();
    this.ngOnQuoteInit?.();
  };

  private resetView(): void {
    document.body.scrollTop = 0; // For Safari browsers
    document.documentElement.scrollTo(0, 0); // For other browsers
  }
}
