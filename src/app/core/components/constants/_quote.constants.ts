import { InjectionToken, Type } from '@angular/core';
import { QuoteControlModel } from '../../models';
import { TrackedData } from '../../tracking';
import { QuoteComponent } from '../_quote-component';

type Manifest<T> = Record<string, { component: Type<T> }>;

export interface LibraryManifest<T> {
  components: Manifest<T>;
  tracks: Record<string, TrackedData>;
}

export interface QuoteWorkflowSettings<T extends QuoteComponent<Q>, Q extends QuoteControlModel> {
  errorPageId: keyof Manifest<T>;
  manifest: LibraryManifest<T>;
  initialize: () => Q;
  hash: (quote: Q) => string;
}

export const NX_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteControlModel>, QuoteControlModel>>(
  'NX_WORKFLOW_TOKEN'
);
