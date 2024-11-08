import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteComponent } from 'src/app/core/models';

const isPreviousStep = ({ navigation: { nextPage, viewedPages } }: AppContextData): boolean =>
  !!nextPage && viewedPages.includes(nextPage.pageId);

const stepperChange = ({ navigation: { nextPage, lastPage } }: AppContextData) =>
  !!nextPage?.stepper && !!lastPage?.stepper && nextPage.stepper.key !== lastPage.stepper.key;

const isErrorPage = ({ navigation: { nextPage }, configuration: { errorPageId } }: AppContextData) => errorPageId === nextPage?.pageId;

export const isValidGuard: CanDeactivateFn<QuoteComponent> = (
  component: QuoteComponent,
  currentRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  next?: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

  return (
    isErrorPage(context) ||
    isPreviousStep(context) ||
    stepperChange(context) ||
    (component.canDeactivate?.bind(component)(currentRoute, state, next) ?? true)
  );
};
