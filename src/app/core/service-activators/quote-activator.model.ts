import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { QuoteFormValidation } from '../form';
import { BudgetActivator } from './budget.activator';
import { QuoteActivator } from './quote.activator';

export type ActivatorFn = (params?: unknown) => Promise<unknown>;
export type ServiceActivatorFn = (services: ActivatorServices) => ActivatorFn;
export type Activator = Partial<Record<EntryPoint, ServiceActivatorFn>>;
export type ServiceActivatorType = `$${string}`;
export type ValidationActivatorType = `#${string}-${QuoteFormValidation}`;
export type EntryPoint = 'next-page' | 'previous-page' | 'on-init' | 'on-destroy' | ServiceActivatorType | ValidationActivatorType;

export const Activators: Activator = {
  '$patch-quote': QuoteActivator.quotePatch,
  '$retrieve-budget': BudgetActivator.retrieveBudget,
  '$store-budget': BudgetActivator.storeBudget
};

export interface ActivatorConfig {
  resetRouting?: boolean;
}

export interface ActivatorServices {
  contextDataService: ContextDataService;
  httpService?: HttpService;
}
