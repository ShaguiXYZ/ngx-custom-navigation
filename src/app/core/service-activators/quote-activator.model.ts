import { ContextDataService } from '@shagui/ng-shagui/core';

export type ActivatorFnType =
  | 'store-budget'
  | 'retrieve-budget'
  | 'black-list-identification-number'
  | 'black-list-plate'
  | 'black-list-phone'
  | 'black-list-email'
  | 'patch-quote';

export type EntryPoints = 'next-page' | 'previous-page' | 'on-pricing' | ActivatorFnType;

export type ActivatorFn = (params?: unknown) => Promise<unknown>;

export interface ActivatorConfig {
  resetRouting?: boolean;
}

export interface ActivatorServices {
  contextDataService?: ContextDataService;
}
