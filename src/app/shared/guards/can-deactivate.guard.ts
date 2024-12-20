import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteModel } from 'src/app/core/models';
import { QuoteComponent } from 'src/app/library';

export const canDeactivateGuard: CanDeactivateFn<{ _instance: QuoteComponent }> = (
  component: { _instance: QuoteComponent },
  currentRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  next?: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const contextDataService = inject(ContextDataService);
  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

  const isPreviousStep = ({ navigation: { nextPage, viewedPages } }: AppContextData): boolean =>
    !!nextPage && viewedPages.includes(nextPage.pageId);

  const stepperChange = ({ navigation: { nextPage, lastPage } }: AppContextData) =>
    !!nextPage?.stepper && !!lastPage?.stepper && nextPage.stepper.key !== lastPage.stepper.key;

  const isErrorPage = ({ navigation: { nextPage }, configuration: { errorPageId } }: AppContextData) => errorPageId === nextPage?.pageId;

  const canDeactivate = (): boolean => {
    const instance = component._instance;
    const canDeactivate = (instance.canDeactivate?.bind(component._instance)(currentRoute, state, next) ?? true) as boolean;

    instance['_contextData'].signature = {
      ...(instance['_contextData'].signature ?? {}),
      ...QuoteModel.signModel(instance['_contextData'])
    };

    if (!canDeactivate) {
      context.navigation.nextPage = context.navigation.lastPage;
      contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);
    }

    return canDeactivate;
  };

  return isErrorPage(context) || isPreviousStep(context) || stepperChange(context) || canDeactivate();
};
