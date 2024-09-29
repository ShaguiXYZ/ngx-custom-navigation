import { inject, Injectable } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';

@Injectable()
export class QuoteStepperService {
  private contextDataService = inject(ContextDataService);

  constructor() {
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    console.log(`QuoteStepperService ${QUOTE_APP_CONTEXT_DATA}`, context);
  }
}
