import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { QuoteFormValidation } from '../form';
import { MaybePromise } from '../models';
import { QuoteTrackService } from '../tracking';
import { BudgetActivator } from './budget.activator';
import { QuoteActivator } from './quote.activator';

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
export type ActivatorFn<TParams = unknown, TResult = unknown> = (params?: TParams) => MaybePromise<TResult>;
export type ServiceActivatorFn<TParams = unknown, TResult = unknown> = ({
  contextDataService
}: ActivatorServices) => ActivatorFn<TParams, TResult>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Activator = Partial<Record<EntryPoint, ServiceActivatorFn<any, any>>>;

export const QUOTE_ACTIVATORS: Activator = {
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
