/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteControlModel, Track, TrackPoints } from 'src/app/core/models';

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
  const workFlowToken = inject(NX_WORKFLOW_TOKEN);
  const contextDataService = inject(ContextDataService);

  /**
   * Updates the track information based on the current and previous stepper keys.
   *
   * @param {AppContextData} param0 - The application context data containing configuration and navigation details.
   * @param {Object} param0.configuration - The configuration object.
   * @param {Object} param0.configuration.steppers - The steppers configuration.
   * @param {Object} param0.navigation - The navigation object.
   * @param {Object} param0.navigation.nextPage - The next page navigation details.
   * @param {Object} param0.navigation.lastPage - The last page navigation details.
   * @param {Object} param0.navigation.track - The current track information.
   * @returns {Track | undefined} - The updated track information or undefined if no updates are made.
   */
  const trackControl = ({
    configuration: { steppers },
    navigation: { nextPage, lastPage, track = TrackPoints.init<QuoteControlModel>(), viewedPages }
  }: AppContextData): TrackPoints => {
    const nextStepperKey = nextPage?.stepper?.key;
    const lastStepperKey = lastPage?.stepper?.key;
    const _track = deepCopy(track);

    if (lastStepperKey && nextStepperKey !== lastStepperKey) {
      const lastStepper = steppers?.[lastStepperKey];

      if (lastStepper?.stateInfo?.inherited === false) {
        const inData = _track.stepper[lastStepperKey]?.inData;

        _track.stepper = {
          ..._track.stepper,
          [lastStepperKey]: { data: deepCopy(contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA)) }
        };
        inData && contextDataService.set(QUOTE_CONTEXT_DATA, inData);
      }

      const nextStepper = nextStepperKey && steppers?.[nextStepperKey];

      if (nextStepper && nextStepper?.stateInfo?.inherited === false) {
        const quote = deepCopy(contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA));
        const tracked = _track.stepper[nextStepperKey]?.data ?? workFlowToken.initialize();

        _track.stepper = { ..._track.stepper, [nextStepperKey]: { inData: quote, data: tracked } };
        contextDataService.set(QUOTE_CONTEXT_DATA, tracked);
      }
    }

    const _pageKey = nextPage?.pageId || undefined;

    if (_pageKey && _track.page[_pageKey]) {
      const pageIndex = viewedPages.indexOf(nextPage!.pageId);
      const viewedPagesAfter = pageIndex >= 0 ? viewedPages.slice(pageIndex) : [nextPage!.pageId];

      contextDataService.set(QUOTE_CONTEXT_DATA, _track.page[_pageKey].data);

      viewedPagesAfter.forEach(pageId => {
        // const key = trackKey('page', pageId);

        if (_track.page[pageId]) {
          delete _track.page[pageId];
        }
      });
    }

    return _track;
  };

  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
  const {
    configuration: { errorPageId },
    navigation: { viewedPages }
  } = context;
  const nextPage = context.navigation.nextPage ?? context.configuration.pageMap[viewedPages[viewedPages.length - 1]];
  const track = trackControl(context);
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
