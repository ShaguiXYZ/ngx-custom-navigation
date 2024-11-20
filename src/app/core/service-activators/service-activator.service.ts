import { inject, Injectable } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteModel } from '../models';
import { BlackListActivator } from './black-list.activator';
import { BudgetActivator } from './budget.activator';
import { ActivatorFn, ActivatorFnType, EntryPoints } from './quote-activator.model';
import { ConditionEvaluation } from '../lib';

@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private activators: Record<string, ActivatorFn> = {};

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.registerActivator('store-budget', BudgetActivator.storeBudget.bind(this)({ contextDataService: this.contextDataService }));
    this.registerActivator('retrieve-budget', BudgetActivator.retrieveBudget.bind(this)({ contextDataService: this.contextDataService }));
    this.registerActivator(
      'black-list-identification-number',
      BlackListActivator.checkIdentificationNumberBlackList.bind(this)({ contextDataService: this.contextDataService })
    );
    this.registerActivator(
      'black-list-plate',
      BlackListActivator.checkPlateBlackList.bind(this)({ contextDataService: this.contextDataService })
    );
    this.registerActivator(
      'black-list-phone',
      BlackListActivator.checkPhoneBlackList.bind(this)({ contextDataService: this.contextDataService })
    );
    this.registerActivator(
      'black-list-email',
      BlackListActivator.checkEmailBlackList.bind(this)({ contextDataService: this.contextDataService })
    );
  }

  public activateService = async (name: EntryPoints): Promise<void> => {
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
    this.activators[name]?.(params).then(value => value && this.activateService(name));
}
