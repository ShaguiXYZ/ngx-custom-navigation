import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData } from './app-context-data.model';
import { QuoteModel } from './quote.model';
import { TrackInfo } from '../tracking';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  template: ''
})
export abstract class QuoteComponent {
  public ignoreChangeDetection = false;

  protected _trackInfo: Partial<TrackInfo> = {};
  protected _contextData: QuoteModel;

  protected readonly quoteLiteral = inject(QuoteLiteralPipe);

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this._contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.__updateComponentData();
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private __updateComponentData = (): Promise<void> => Promise.resolve().then(() => this.__loadComponentData(this));

  private __loadComponentData = <T extends QuoteComponent>(component: T): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageData = lastPage?.configuration?.data ?? {};

    this._trackInfo = { selected_tab: lastPage?.routeTree };

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component[`_${key}`] === 'object' && typeof value === 'object') {
        this.__updateData(component[`_${key}`], value as Record<string, unknown>);
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
