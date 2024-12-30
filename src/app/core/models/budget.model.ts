import { AppContextData } from './_app-context-data.model';
import { QuoteControlModel } from './quote-control.model';

export interface Budget {
  context: AppContextData;
  quote: QuoteControlModel;
}

export interface StoredDataKey {
  key: string;
  passKey: string;
}
