import { Configuration, Page } from './configuration';

export type NavigationOperation = 'next' | 'previous';

export interface AppContextData {
  configuration: Configuration;
  navigation: Navigation;
}

export interface Navigation {
  currentPage: Page;
  nextPage?: Page;
  operation?: NavigationOperation;
  viewedPages: Array<string>;
}

export namespace AppContextData {
  export const init = (configuration: Configuration, viewedPages: string[]): AppContextData => {
    const homePage = configuration.pageMap[configuration.homePageId];

    return {
      configuration,
      navigation: viewedPages.length
        ? {
            currentPage: configuration.pageMap[viewedPages[viewedPages.length - 1]],
            nextPage: configuration.pageMap[viewedPages[viewedPages.length - 1]],
            viewedPages
          }
        : {
            currentPage: homePage,
            nextPage: homePage,
            viewedPages: [homePage.pageId]
          }
    };
  };
}
