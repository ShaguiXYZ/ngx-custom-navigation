/* eslint-disable @typescript-eslint/no-namespace */
import { Configuration, Page } from './_configuration.model';
import { QuoteControlModel } from './quote-control.model';
import { QuoteSettingsModel } from './quote-settings.model';

type TrackType = 'stepper' | 'page';

export interface TrackData<T extends QuoteControlModel> {
  data?: T;
  inData?: T;
}

export type Track<T extends QuoteControlModel = QuoteControlModel> = Record<string, TrackData<T>>;
export type TrackPoints<T extends QuoteControlModel = QuoteControlModel> = Record<TrackType, Track<T>>;

export namespace TrackPoints {
  export const init = <T extends QuoteControlModel>(): TrackPoints<T> => ({
    stepper: {},
    page: {}
  });
}

export interface Navigation<T extends QuoteControlModel, K = string> {
  nextPage?: Page<T, K>;
  lastPage?: Page<T, K>;
  viewedPages: string[];
  track?: TrackPoints<T>;
}

export interface AppContextData<T extends QuoteControlModel = QuoteControlModel, K = string> {
  settings: QuoteSettingsModel;
  configuration: Configuration<T, K>;
  navigation: Navigation<T, K>;
}

export namespace AppContextData {
  export const init = <T extends QuoteControlModel>(
    settings: Partial<QuoteSettingsModel>,
    configuration: Configuration<T>
  ): AppContextData<T> => {
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
