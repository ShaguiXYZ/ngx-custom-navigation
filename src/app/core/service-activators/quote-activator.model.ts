import { ContextDataService } from '@shagui/ng-shagui/core';
import { BudgetActivator } from './budget.activator';
import { BlackListActivator } from './black-list.activator';
import { QuoteActivator } from './quote.activator';

export type ActivatorFn = (params?: unknown) => Promise<unknown>;

export type ActivatorFnType =
  | 'store-budget'
  | 'retrieve-budget'
  | 'black-list-identification-number'
  | 'black-list-plate'
  | 'black-list-phone'
  | 'black-list-email'
  | 'patch-quote';

export type EntryPoints = 'next-page' | 'previous-page' | 'on-pricing' | ActivatorFnType;

export const ServiceActivators: Record<ActivatorFnType, (services: ActivatorServices) => ActivatorFn> = {
  'store-budget': BudgetActivator.storeBudget,
  'retrieve-budget': BudgetActivator.retrieveBudget,
  'black-list-identification-number': BlackListActivator.checkIdentificationNumberBlackList,
  'black-list-plate': BlackListActivator.checkPlateBlackList,
  'black-list-phone': BlackListActivator.checkPhoneBlackList,
  'black-list-email': BlackListActivator.checkEmailBlackList,
  'patch-quote': QuoteActivator.quotePatch
};

export interface ActivatorConfig {
  resetRouting?: boolean;
}

export interface ActivatorServices {
  contextDataService: ContextDataService;
}
