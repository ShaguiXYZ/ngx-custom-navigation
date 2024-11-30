/* eslint-disable @typescript-eslint/no-namespace */
import { Configuration, Page } from './configuration.model';
import { QuoteSettingsModel } from './quote-settings.model';
import { QuoteModel } from './quote.model';

export interface TrackData {
  data?: QuoteModel;
  inData?: QuoteModel;
}

export type Track = Record<string, TrackData>;

export interface Navigation {
  nextPage?: Page;
  lastPage?: Page;
  viewedPages: string[];
  track?: Track;
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

    if (updatedViewedPages[0] !== homePage.pageId) {
      updatedViewedPages.unshift(homePage.pageId);
    }

    return {
      settings,
      configuration,
      navigation: {
        viewedPages: updatedViewedPages
      }
    };
  };
}
