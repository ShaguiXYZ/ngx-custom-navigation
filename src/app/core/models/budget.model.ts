import { AppContextData } from './app-context-data.model';
import { QuoteModel } from './quote.model';

export interface Budget {
  context: AppContextData;
  quote: QuoteModel;
}

export interface StoredDataKey {
  key: string;
  passKey: string;
}

export interface StoredData {
  name: string;
  cipher: string;
}
