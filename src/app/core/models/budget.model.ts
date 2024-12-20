import { AppContextData } from './_app-context-data.model';
import { QuoteModel } from './_quote.model';

export interface Budget {
  context: AppContextData;
  quote: QuoteModel;
}

export interface StoredDataKey {
  key: string;
  passKey: string;
}
