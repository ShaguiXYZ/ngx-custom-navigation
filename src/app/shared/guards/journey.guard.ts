import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';

export const journeyGuard: CanActivateFn = (route, state) => {
  const contextDataService = inject(ContextDataService);
  const router = inject(Router);

  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA_NAME);

  if (context.viewedPages.find(page => page.id === state.url.substring(1))) {
    return true;
  }

  router.navigate([context.viewedPages.pop()?.id]);
  return false;
};
