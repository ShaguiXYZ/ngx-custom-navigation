import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ConditionEvaluation, patch } from 'src/app/core/lib';
import { AppContextData, Page, QuoteControlModel } from 'src/app/core/models';

@Component({
    template: '',
    standalone: false
})
export abstract class QuoteComponent<T extends QuoteControlModel> implements OnDestroy {
  protected _contextData: T;
  protected subscription$: Subscription[] = [];

  protected readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.subscription$.push(this.contextDataService.onDataChange<T>(QUOTE_CONTEXT_DATA).subscribe(data => (this._contextData = data)));
    this._contextData = this.contextDataService.get<T>(QUOTE_CONTEXT_DATA);
    Promise.resolve().then(() => this.__updateComponentData(this));
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private __updateComponentData = <C extends QuoteComponent<T>>(component: C): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageData = lastPage?.configuration?.data ?? {};

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component['_contextData'] === 'object' && typeof value === 'object') {
        component['_contextData'] = patch(component['_contextData'], value as Record<string, unknown>);
        this.contextDataService.set(QUOTE_CONTEXT_DATA, component['_contextData']);
      } else if (key in component) {
        component[key as keyof C] = deepCopy(value) as C[keyof C];
      }
    }

    lastPage && this.__zones(lastPage, component);
  };

  private __zones = (page: Page, component: QuoteComponent<T>): void => {
    if (!page.configuration?.zones) {
      return;
    }

    const sections = Array.from(document.getElementsByTagName('quote-zone'));

    Object.entries(page.configuration.zones).forEach(([key, value]) => {
      const index = Number(key);

      if (value.skipLoad && sections[index] && ConditionEvaluation.checkConditions(component['_contextData'], value.conditions)) {
        sections[index].remove();
      }
    });
  };
}
