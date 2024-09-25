import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';

export const journeyGuard: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const router = inject(Router);

  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
  const nextPage = context.navigation.nextPage;

  if (nextPage?.pageId) {
    console.log('nextPage', nextPage);
    console.log('context', context);

    context.navigation.nextPage = undefined;
    contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

    router
      .navigate([context.configuration.pageMap[nextPage.pageId].route])
      .then(() => {
        const pageIndex = context.navigation.viewedPages.findIndex(id => id === nextPage.pageId);

        if (pageIndex > -1) {
          context.navigation.viewedPages.splice(pageIndex + 1);
        } else {
          context.navigation.viewedPages.push(nextPage.pageId!);
        }

        contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

        return true;
      })
      .catch(() => {
        return false;
      });
  }

  return Promise.resolve(true);
};
