import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { QuoteFormValidation } from '../form';
import { BudgetActivator } from './budget.activator';
import { QuoteActivator } from './quote.activator';
import { QuoteTrackService } from '../tracking';

export type ActivatorFn = (params?: unknown) => Promise<unknown>;
export type ServiceActivatorFn = (services: ActivatorServices) => ActivatorFn;
export type Activator = Partial<Record<EntryPoint, ServiceActivatorFn>>;
export type ServiceActivatorType = `$${string}`;
export type ValidationActivatorType = `#${string}-${QuoteFormValidation}`;
export type OnErrorActivatorType = `on-${string}-error`;
export type EntryPoint =
  | 'next-page'
  | 'previous-page'
  | 'on-init'
  | 'on-destroy'
  | OnErrorActivatorType
  | ServiceActivatorType
  | ValidationActivatorType;

export const Activators: Activator = {
  '$patch-quote': QuoteActivator.quotePatch,
  '$track-quote': QuoteActivator.quoteTrack,
  '$retrieve-budget': BudgetActivator.retrieveBudget,
  '$store-budget': BudgetActivator.storeBudget
};

export interface ActivatorServices {
  contextDataService: ContextDataService;
  httpService?: HttpService;
  trackService?: QuoteTrackService;
}
