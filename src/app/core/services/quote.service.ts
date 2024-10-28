import { inject, Injectable } from '@angular/core';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { AppContextData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private contextDataService = inject(ContextDataService);

  public loadComponentData = <T extends object>(component: T): void => {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = contextData?.navigation.lastPage;
    const pageData = { ...{}, ...lastPage?.configuration?.data };

    Object.entries(pageData).forEach(
      ([key, value]) => Object.prototype.hasOwnProperty.call(component, key) && Object.assign(component, { [key]: deepCopy(value) })
    );
  };
}
