import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData } from './app-context-data.model';
import { QuoteModel } from './quote.model';

@Component({
  template: ''
})
export abstract class QuoteComponent {
  public ignoreChangeDetection = false;

  protected contextData: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.__updateComponentData();
  }

  protected populateContextData = (): void => {
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
  };

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private __updateComponentData = (): Promise<void> => Promise.resolve().then(() => this.__loadComponentData(this));

  private __loadComponentData = <T extends QuoteComponent>(component: T): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageData = lastPage?.configuration?.data ?? {};

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component[key] === 'object' && typeof value === 'object') {
        this.__updateData(component[key], value as Record<string, unknown>);
      } else if (key in component) {
        component[key as keyof T] = deepCopy(value) as T[keyof T];
      }
    }
  };

  /**
   * Recursively updates the properties of the `data` object with the properties from the `newData` object.
   * If a property in `newData` is an object and exists in `data`, the function will recursively update that object.
   * Otherwise, it will directly assign the value from `newData` to `data`.
   *
   * @param data - The original data object to be updated.
   * @param newData - The new data object containing updates.
   */
  private __updateData = (data: Record<string, unknown>, newData: Record<string, unknown>): void => {
    if (data && newData) {
      Object.entries(newData).forEach(([key, value]) => {
        if (!!value && typeof value === 'object' && key in data) {
          this.__updateData(data[key] as Record<string, unknown>, value as Record<string, unknown>);
        } else {
          data[key] = value;
        }
      });
    }
  };
}
