import { InjectionToken, Type } from '@angular/core';
import { QuoteControlModel, SignatureModel } from '../../models';
import { QuoteComponent } from '../_quote-component';

type Manifest<T> = Record<string, { component: Type<T> }>;

export interface QuoteWorkflowSettings<T extends QuoteComponent<Q>, Q extends QuoteControlModel> {
  errorPageId: keyof Manifest<T>;
  manifest: Manifest<T>;
  initializedModel: () => Q;
  signModel: (quote: Q) => SignatureModel;
}

export const QUOTE_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteControlModel>, QuoteControlModel>>(
  'QUOTE_WORKFLOW_TOKEN'
);
