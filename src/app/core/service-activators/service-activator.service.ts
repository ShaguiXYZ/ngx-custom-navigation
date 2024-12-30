import { inject, Injectable } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, QuoteControlModel } from '../models';
import { ActivatorFn, ActivatorFnType, Activators, EntryPoint } from './quote-activator.model';

@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private activators: Record<string, ActivatorFn> = {};

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    Object.entries(Activators).forEach(([name, activatorFn]) =>
      this.registerActivator(name as ActivatorFnType, activatorFn({ contextDataService: this.contextDataService }))
    );
  }

  public activateEntryPoint = async (name: EntryPoint): Promise<void> => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (!lastPage) {
      return;
    }

    const entryPoints = lastPage.configuration?.serviceActivators?.filter(entryPoint => entryPoint.entryPoint === name);

    await Promise.all(
      (entryPoints ?? []).map(async entryPoint => {
        if (
          ConditionEvaluation.checkConditions(this.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA), entryPoint.conditions)
        ) {
          console.log('Activating', entryPoint.activator);

          await this.runActivator(entryPoint.activator, entryPoint.params);
        }
      })
    );
  };

  private registerActivator = (name: ActivatorFnType, activator: ActivatorFn): void => {
    this.activators[name] = activator;
  };

  private runActivator = (name: ActivatorFnType, params?: unknown): Promise<unknown> =>
    this.activators[name]?.(params).then(value => value && this.activateEntryPoint(name));
}
