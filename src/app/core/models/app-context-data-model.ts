/* eslint-disable @typescript-eslint/no-namespace */
import { Configuration, Page } from './configuration.model';

export interface Navigation {
  nextPage?: Page;
  lastPage?: Page;
  viewedPages: string[];
}

export interface AppContextData {
  configuration: Configuration;
  navigation: Navigation;
}

export namespace AppContextData {
  export const init = (configuration: Configuration, viewedPages: string[] = []): AppContextData => {
    const homePage = configuration.pageMap[configuration.homePageId];
    const updatedViewedPages = viewedPages.length ? viewedPages : [homePage.pageId];

    return {
      configuration,
      navigation: {
        viewedPages: updatedViewedPages
      }
    };
  };
}
