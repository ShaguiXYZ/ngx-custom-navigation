import { AppContextData } from './app-context-data.model';
import { QuoteModel } from './quote.model';

export interface BudgetModel {
  context: AppContextData;
  quote: QuoteModel;
}

export interface StoredData {
  key: string;
  passKey: string;
}
