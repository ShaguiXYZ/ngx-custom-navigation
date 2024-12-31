import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { QUOTE_WORKFLOW_TOKEN } from 'src/app/core/components/constants';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteControlModel } from 'src/app/core/models';

export const canDeactivateGuard: CanDeactivateFn<{ _instance: QuoteComponent<QuoteControlModel> }> = (
  component: { _instance: QuoteComponent<QuoteControlModel> },
  currentRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  next?: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const workFlowToken = inject(QUOTE_WORKFLOW_TOKEN);
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
      ...workFlowToken.signModel(instance['_contextData'])
    };

    if (!canDeactivate) {
      context.navigation.nextPage = context.navigation.lastPage;
      contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);
    }

    return canDeactivate;
  };

  return isErrorPage(context) || isPreviousStep(context) || stepperChange(context) || canDeactivate();
};
