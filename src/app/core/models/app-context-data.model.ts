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
    const homePageId = configuration.homePageId;
    const updatedViewedPages = viewedPages.length ? viewedPages : [homePageId];

    if (updatedViewedPages[0] !== homePageId) {
      updatedViewedPages.unshift(homePageId);
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
