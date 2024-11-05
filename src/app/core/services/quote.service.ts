import { inject, Injectable } from '@angular/core';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteComponent } from '../models';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private contextDataService = inject(ContextDataService);

  public loadComponentData = <T extends QuoteComponent>(component: T): void => {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = contextData?.navigation.lastPage;
    const pageData = lastPage?.configuration?.data ?? {};

    for (const [key, value] of Object.entries(pageData)) {
      if (key === 'contextData' && typeof component[key] === 'object' && typeof value === 'object') {
        this.updateData(component[key], value as Record<string, unknown>);
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
  private updateData = (data: Record<string, unknown>, newData: Record<string, unknown>): void => {
    if (data && newData) {
      Object.entries(newData).forEach(([key, value]) => {
        if (!!value && typeof value === 'object' && key in data) {
          this.updateData(data[key] as Record<string, unknown>, value as Record<string, unknown>);
        } else {
          data[key] = value;
        }
      });
    }
  };
}
