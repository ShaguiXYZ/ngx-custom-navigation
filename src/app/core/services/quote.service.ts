import { inject, Injectable } from '@angular/core';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteComponent } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private contextDataService = inject(ContextDataService);

  public loadComponentData = <T extends QuoteComponent>(component: T): void => {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = contextData?.navigation.lastPage;
    const pageData = { ...lastPage?.configuration?.data };

    Object.entries(pageData).forEach(([key, value]) => {
      if (key === 'contextData' && typeof component['contextData'] === 'object' && typeof value === 'object') {
        Object.assign(component, { [key]: { ...component['contextData'], ...value } });
      } else if (Object.prototype.hasOwnProperty.call(component, key)) {
        Object.assign(component, { [key]: deepCopy(value) });
      }
    });
  };
}
