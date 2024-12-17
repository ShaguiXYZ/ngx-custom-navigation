import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../core/constants';
import { ConditionEvaluation, patch } from '../../core/lib';
import { AppContextData } from '../../core/models/app-context-data.model';
import { Page } from '../../core/models/configuration.model';
import { QuoteModel } from '../../core/models/quote.model';

@Component({
  template: ''
})
export abstract class QuoteComponent implements OnDestroy {
  protected _contextData: QuoteModel;
  protected subscription$: Subscription[] = [];

  protected readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.subscription$.push(
      this.contextDataService.onDataChange<QuoteModel>(QUOTE_CONTEXT_DATA).subscribe(data => (this._contextData = data))
    );
    this._contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    Promise.resolve().then(() => this.__updateComponentData(this));
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private __updateComponentData = <T extends QuoteComponent>(component: T): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageData = lastPage?.configuration?.data ?? {};

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component['_contextData'] === 'object' && typeof value === 'object') {
        component['_contextData'] = patch(component['_contextData'], value as Record<string, unknown>);
        this.contextDataService.set(QUOTE_CONTEXT_DATA, component['_contextData']);
      } else if (key in component) {
        component[key as keyof T] = deepCopy(value) as T[keyof T];
      }
    }

    lastPage && this.__zones(lastPage, component);
  };

  private __zones = (page: Page, component: QuoteComponent): void => {
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
