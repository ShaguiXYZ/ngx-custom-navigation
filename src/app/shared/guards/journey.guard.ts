import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';

export const journeyGuard: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
  const { nextPage, viewedPages } = context.navigation;

  if (!nextPage?.pageId) {
    return false;
  }

  const pageIndex = viewedPages.indexOf(nextPage.pageId);

  if (pageIndex > -1) {
    viewedPages.splice(pageIndex + 1);
  } else {
    viewedPages.push(nextPage.pageId);
  }

  context.navigation.nextPage = undefined;
  context.navigation.viewedPages = viewedPages;
  contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

  return true;
};
