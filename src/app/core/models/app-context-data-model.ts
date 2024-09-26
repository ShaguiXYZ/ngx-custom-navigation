import { Configuration, Page } from './configuration';

export interface Navigation {
  nextPage?: Page;
  viewedPages: string[];
}

export interface AppContextData {
  configuration: Configuration;
  navigation: Navigation;
}

export namespace AppContextData {
  export const init = (configuration: Configuration, viewedPages: string[] = []): AppContextData => {
    const homePage = configuration.pageMap[configuration.homePageId];
    const nextPage = viewedPages.length ? configuration.pageMap[viewedPages[viewedPages.length - 1]] : homePage;
    const updatedViewedPages = viewedPages.length ? viewedPages : [homePage.pageId];

    return {
      configuration,
      navigation: {
        nextPage,
        viewedPages: updatedViewedPages
      }
    };
  };
}
