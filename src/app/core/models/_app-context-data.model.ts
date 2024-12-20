/* eslint-disable @typescript-eslint/no-namespace */
import { Configuration, Page } from './configuration.model';
import { QuoteSettingsModel } from './quote-settings.model';
import { QuoteModel } from './_quote.model';

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
  export const init = (settings: Partial<QuoteSettingsModel>, configuration: Configuration): AppContextData => {
    const homePageId = configuration.homePageId;

    return {
      settings: settings as QuoteSettingsModel,
      configuration,
      navigation: {
        viewedPages: [homePageId]
      }
    };
  };
}
