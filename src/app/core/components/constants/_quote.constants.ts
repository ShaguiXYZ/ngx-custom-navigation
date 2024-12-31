import { InjectionToken, Type } from '@angular/core';
import { QuoteControlModel, SignatureModel } from '../../models';
import { QuoteComponent } from '../_quote-component';

export interface QuoteWorkflowSettings<T extends QuoteComponent<Q>, Q extends QuoteControlModel> {
  errorPageId: string;
  manifest: Record<string, { component: Type<T> }>;
  initializedModel: () => Q;
  signModel: (quote: Q) => SignatureModel;
}

export const QUOTE_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteControlModel>, QuoteControlModel>>(
  'QUOTE_WORKFLOW_TOKEN'
);
