import { inject, Injectable } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, QuoteModel } from '../models';
import { ActivatorFn, ActivatorFnType, EntryPoints, ServiceActivators } from './quote-activator.model';

@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private activators: Record<string, ActivatorFn> = {};

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    Object.entries(ServiceActivators).forEach(([name, activator]) =>
      this.registerActivator(name as ActivatorFnType, activator({ contextDataService: this.contextDataService }))
    );
  }

  public activateEntryPoint = async (name: EntryPoints): Promise<void> => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (!lastPage) {
      return;
    }

    const entryPoints = lastPage.entryPoints?.filter(entryPoint => entryPoint.id === name);

    entryPoints?.forEach(async entryPoint => {
      if (ConditionEvaluation.checkConditions(this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA), entryPoint.conditions)) {
        await this.runActivator(entryPoint.activator, entryPoint.params);
      }
    });
  };

  private registerActivator = (name: ActivatorFnType, activator: ActivatorFn): void => {
    this.activators[name] = activator;
  };

  private runActivator = (name: ActivatorFnType, params?: unknown): Promise<unknown> =>
    this.activators[name]?.(params).then(value => value && this.activateEntryPoint(name));
}
