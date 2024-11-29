/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page, QuoteModel } from 'src/app/core/models';

/**
 * Guard function to control navigation flow based on the application's context data.
 *
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns A `MaybeAsync<GuardResult>` which can be a boolean or a UrlTree.
 *
 * This guard performs the following actions:
 * - Injects the `ContextDataService` and `Router` services.
 * - Retrieves the application context data.
 * - Checks if there is a `nextPage` defined in the navigation context.
 *   - If not, sets the `lastPage` to undefined and updates the `nextPage` to the last viewed page.
 *   - Updates the context data and navigates to the `nextPage`.
 * - If `nextPage` is defined:
 *   - Retrieves the `homePageId` and `errorPageId` from the configuration.
 *   - Updates the `viewedPages` array based on the `nextPage`.
 *   - Updates the navigation context with the new `viewedPages`, `lastPage`, and sets `nextPage` to undefined.
 *   - If the `nextPage` is the home page, initializes the quote context data.
 *   - Updates the browser's history state with the `nextPage` route.
 * - Returns `true` to allow the navigation.
 */
export const journeyGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const router = inject(Router);

  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
  const { nextPage, viewedPages } = context.navigation;

  const statelessControl = ({ configuration: { steppers }, navigation: { nextPage, lastPage } }: AppContextData): void => {
    const nextStepperKey = nextPage?.stepper?.key;
    const lastStepperKey = lastPage?.stepper?.key;

    if (lastStepperKey && nextStepperKey !== lastStepperKey) {
      const nextStepper = nextStepperKey && steppers?.steppersMap[nextStepperKey];
      const lastStepper = steppers?.steppersMap[lastStepperKey];

      if (lastStepper?.stateless) {
        lastStepper.stateless.data = contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
        contextDataService.set(QUOTE_CONTEXT_DATA, lastStepper.stateless.inData);
      }

      if (nextStepper && nextStepper?.stateless) {
        const lastQuote = contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
        nextStepper.stateless.inData = lastQuote;

        if (!nextStepper.stateless.data) {
          nextStepper.stateless.data = nextStepper.stateless.inherited ? lastQuote ?? QuoteModel.init() : QuoteModel.init();
        }

        contextDataService.set(QUOTE_CONTEXT_DATA, nextStepper.stateless.data);
      }
    }
  };

  const resetContext = (context: AppContextData): UrlTree => {
    const nextPage = context.configuration.pageMap[viewedPages[viewedPages.length - 1]];

    context.navigation.lastPage = undefined;
    context.navigation.nextPage = nextPage;
    contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

    return router.parseUrl(`${Page.routeFrom(context.navigation.nextPage)}`);
  };

  if (!nextPage?.pageId) return resetContext(context);

  statelessControl(context);

  const { homePageId, errorPageId } = context.configuration;
  const pageIndex = viewedPages.indexOf(nextPage.pageId);

  let lastPage = nextPage;

  if (pageIndex > -1) {
    viewedPages.splice(pageIndex + 1);
  } else if (nextPage.pageId !== errorPageId) {
    viewedPages.push(nextPage.pageId);
  } else {
    lastPage = context.configuration.pageMap[errorPageId];
  }

  context.navigation = { ...context.navigation, viewedPages, lastPage, nextPage: undefined };
  contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

  homePageId === nextPage.pageId && contextDataService.set(QUOTE_CONTEXT_DATA, QuoteModel.init());

  window.history.pushState({}, '', nextPage.routeTree ?? Page.routeFrom(nextPage));

  return true;
};
