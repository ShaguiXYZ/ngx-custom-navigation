import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA_NAME, QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { QuoteModel } from '../models';

export const resetContextGuard: CanActivateFn = () => {
  const contextDataService = inject(ContextDataService);

  contextDataService.set(QUOTE_CONTEXT_DATA_NAME, QuoteModel.init());
  contextDataService.set(QUOTE_APP_CONTEXT_DATA_NAME, AppContextData.init());

  console.log('Reset context');
  return true;
};
