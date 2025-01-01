import { InjectionToken, Type } from '@angular/core';
import { QuoteControlModel } from '../../models';
import { QuoteComponent } from '../_quote-component';

type Manifest<T> = Record<string, { component: Type<T> }>;

export interface QuoteWorkflowSettings<T extends QuoteComponent<Q>, Q extends QuoteControlModel> {
  errorPageId: keyof Manifest<T>;
  manifest: Manifest<T>;
  initialize: () => Q;
  hash: (quote: Q) => string;
}

export const QUOTE_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteControlModel>, QuoteControlModel>>(
  'QUOTE_WORKFLOW_TOKEN'
);
