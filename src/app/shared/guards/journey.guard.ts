/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page } from 'src/app/core/models';

export const journeyGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
  const router = inject(Router);
  const { nextPage, viewedPages } = context.navigation;

  if (!nextPage?.pageId) {
    context.navigation.lastPage = undefined;
    context.navigation.nextPage = context.configuration.pageMap[viewedPages[viewedPages.length - 1]];
    contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

    return router.parseUrl(`/${Page.routeFrom(context.navigation.nextPage)}`);
  }

  const pageIndex = viewedPages.indexOf(nextPage.pageId);

  if (pageIndex > -1) {
    viewedPages.splice(pageIndex + 1);
  } else {
    viewedPages.push(nextPage.pageId);
  }

  context.navigation.lastPage = nextPage;
  context.navigation.nextPage = undefined;
  context.navigation.viewedPages = viewedPages;
  contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

  return true;
};
