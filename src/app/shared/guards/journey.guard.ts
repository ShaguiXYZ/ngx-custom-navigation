/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page, QuoteModel, Track } from 'src/app/core/models';

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

  const stateInfoControl = ({
    configuration: { steppers },
    navigation: { nextPage, lastPage, track }
  }: AppContextData): Track | undefined => {
    const nextStepperKey = nextPage?.stepper?.key;
    const lastStepperKey = lastPage?.stepper?.key;
    let _track = deepCopy(track);

    if (lastStepperKey && nextStepperKey !== lastStepperKey) {
      const lastStepper = steppers?.[lastStepperKey];

      if (lastStepper?.stateInfo) {
        const inData = _track?.[lastStepperKey]?.inData;

        _track = { ...(_track ?? {}), [lastStepperKey]: { data: deepCopy(contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA)) } };
        inData && contextDataService.set(QUOTE_CONTEXT_DATA, inData);
      }

      const nextStepper = nextStepperKey && steppers?.[nextStepperKey];

      if (nextStepper && nextStepper?.stateInfo) {
        const quote = deepCopy(contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA));
        const tracked = _track?.[nextStepperKey]?.data ?? (nextStepper.stateInfo.inherited ? quote : QuoteModel.init());

        _track = { ...(_track ?? {}), [nextStepperKey]: { inData: quote, data: tracked } };
        contextDataService.set(QUOTE_CONTEXT_DATA, tracked);
      }
    }

    return _track;
  };

  if (!nextPage?.pageId) return false;

  const track = stateInfoControl(context);
  const { errorPageId } = context.configuration;
  const pageIndex = viewedPages.indexOf(nextPage.pageId);

  let lastPage = nextPage;

  if (pageIndex > -1) {
    viewedPages.splice(pageIndex + 1);
  } else if (nextPage.pageId !== errorPageId) {
    viewedPages.push(nextPage.pageId);
  } else {
    lastPage = context.configuration.pageMap[errorPageId];
  }

  context.navigation = { ...context.navigation, viewedPages, lastPage, nextPage: undefined, track };
  contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);

  return true;
};
