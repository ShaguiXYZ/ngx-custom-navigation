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
 * This guard function uses the application's context data to determine the next step in the navigation flow.
 * It performs the following operations:
 * - Injects the `ContextDataService` to access and manipulate context data.
 * - Defines a helper function `stateInfoControl` to manage the state information of steppers.
 * - Retrieves the current application context data.
 * - Determines the next page to navigate to based on the viewed pages and configuration.
 * - Updates the track information using the `stateInfoControl` function.
 * - Manages the viewed pages and updates the navigation context.
 * - Sets the updated context data back to the `ContextDataService`.
 * - Returns `true` to allow the navigation to proceed.
 */
export const journeyGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
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

  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
  const { viewedPages } = context.navigation;
  const nextPage = context.navigation.nextPage ?? context.configuration.pageMap[viewedPages[viewedPages.length - 1]];
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
