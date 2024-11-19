/* eslint-disable @typescript-eslint/no-namespace */
import { Configuration, Page } from './configuration.model';
import { QuoteSettingsModel } from './quote-settings.model';

export interface Navigation {
  nextPage?: Page;
  lastPage?: Page;
  viewedPages: string[];
}

export interface AppContextData {
  settings: QuoteSettingsModel;
  configuration: Configuration;
  navigation: Navigation;
}

export namespace AppContextData {
  export const init = (settings: QuoteSettingsModel, configuration: Configuration, viewedPages: string[] = []): AppContextData => {
    const homePage = configuration.pageMap[configuration.homePageId];
    const updatedViewedPages = viewedPages.length ? viewedPages : [homePage.pageId];

    return {
      settings,
      configuration,
      navigation: {
        viewedPages: updatedViewedPages
      }
    };
  };
}
