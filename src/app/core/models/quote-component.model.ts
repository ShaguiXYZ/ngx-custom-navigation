import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { patch } from '../lib';
import { AppContextData } from './app-context-data.model';
import { QuoteModel } from './quote.model';
import { Subscription } from 'rxjs';

@Component({
  template: ''
})
export abstract class QuoteComponent implements OnDestroy {
  protected _contextData: QuoteModel;
  protected subscription$: Subscription[] = [];

  protected readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.contextDataService.onDataChange<QuoteModel>(QUOTE_CONTEXT_DATA).subscribe(data => (this._contextData = data));
    this._contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.__updateComponentData();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private __updateComponentData = (): void => this.__loadComponentData(this);

  private __loadComponentData = <T extends QuoteComponent>(component: T): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageData = lastPage?.configuration?.data ?? {};

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component[`_${key}`] === 'object' && typeof value === 'object') {
        component[`_${key}`] = patch(component[`_${key}`], value as Record<string, unknown>);
      } else if (key in component) {
        component[key as keyof T] = deepCopy(value) as T[keyof T];
      }
    }
  };
}
