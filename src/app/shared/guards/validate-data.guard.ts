import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';

const isPreviousStep = ({ navigation: { nextPage, viewedPages } }: AppContextData): boolean =>
  !!nextPage && viewedPages.includes(nextPage.pageId);

const stepperChange = (context: AppContextData) =>
  !!context.navigation.nextPage?.stepper &&
  !!context.navigation.lastPage?.stepper &&
  context.navigation.nextPage.stepper.key !== context.navigation.lastPage.stepper.key;

export interface IsValidData {
  canDeactivate: (
    currentRoute?: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot,
    next?: RouterStateSnapshot
  ) => MaybeAsync<GuardResult>;
}

export const isValidGuard: CanDeactivateFn<IsValidData> = (
  component: IsValidData,
  currentRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  next?: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

  console.log('isValidGuard', context);

  return isPreviousStep(context) || stepperChange(context) || (component.canDeactivate?.bind(component)(currentRoute, state, next) ?? true);
};
