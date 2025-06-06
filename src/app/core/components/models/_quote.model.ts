import { InjectionToken, Type } from '@angular/core';
import { QuoteControlModel } from '../../models';
import { Activator } from '../../service-activators';
import { TrackManifest } from '../../tracking';
import { QuoteComponent } from '../_quote-component';

type Manifest<T> = Record<string, { component: Type<T> }>;

export type WorkflowSettings = QuoteWorkflowSettings<QuoteComponent<QuoteControlModel>, QuoteControlModel>;

export interface LibraryManifest<T> {
  components: Manifest<T>;
  serviceActivators: Activator;
  tracks: TrackManifest;
}

export interface QuoteWorkflowSettings<T extends QuoteComponent<Q>, Q extends QuoteControlModel> {
  errorPageId: keyof Manifest<T>;
  manifest: LibraryManifest<T>;
  loadingOnNav: boolean;
  initialize: () => Q;
  hash: (quote: Q) => string;
}

export const NX_WORKFLOW_TOKEN = new InjectionToken<WorkflowSettings>('NX_WORKFLOW_TOKEN');
