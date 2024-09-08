import { inject } from '@angular/core';
import { CanDeactivateFn, UrlTree } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { SettingsService } from 'src/app/core/services';

type CanDeactivateType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

export interface CanComponentDeactivate {
  canDeactivate: () => CanDeactivateType;
}

export const activatingChildrenGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  const contextDataService = inject(ContextDataService);
  const settingService = inject(SettingsService);

  const nextUrl = nextState.url.substring(1);

  const context = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA_NAME);

  const pages = settingService.configuration.pageMap;

  const fromPage = pages.filter(page => page.pageId === currentState.url.substring(1))[0];

  if (fromPage.pageId === 'on-boarding') {
    context.viewedPages.push({
      id: fromPage.pageId,
      title: fromPage.title,
      showAsBreadcrumb: fromPage.showAsBreadcrumb ?? true
    });
    contextDataService.set(QUOTE_APP_CONTEXT_DATA_NAME, context);
  }

  const indexViewedPage = context.viewedPages.findIndex(child => child.id === nextUrl);

  if (indexViewedPage >= 0) {
    context.viewedPages.splice(indexViewedPage + 1);
    contextDataService.set(QUOTE_APP_CONTEXT_DATA_NAME, context);
    return true;
  } else {
    const nextOption = fromPage.nextOptionList?.find(child => child.nextPageId === nextUrl);
    if (nextOption) {
      const toPage = pages.find(page => page.pageId === nextOption.nextPageId);
      context.viewedPages.push({
        id: toPage!.pageId,
        title: toPage!.title,
        showAsBreadcrumb: toPage!.showAsBreadcrumb ?? true
      });
      contextDataService.set(QUOTE_APP_CONTEXT_DATA_NAME, context);
      return true;
    }
    return false;
  }
};
