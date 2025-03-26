import { inject, Injectable } from '@angular/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from '../components/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, QuoteControlModel } from '../models';
import { Activator, ActivatorFn, Activators, EntryPoint, ServiceActivatorType } from './quote-activator.model';

@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private activators: Record<string, ActivatorFn> = {};

  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);

  constructor() {
    const registerActivators = (activator: Activator): void => {
      Object.entries(activator).forEach(([name, serviceActivatorFn]) => {
        if (serviceActivatorFn) {
          this.registerActivator(
            name as ServiceActivatorType,
            serviceActivatorFn({ contextDataService: this.contextDataService, httpService: this.httpService })
          );
        }
      });
    };

    registerActivators(Activators);
    registerActivators(this.workFlowToken.manifest.serviceActivators ?? {});
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
          console.groupCollapsed('Activating', entryPoint.activator);
          console.log('Service value', await this.runActivator(entryPoint.activator, entryPoint.params));
          console.groupEnd();
        }
      })
    );
  };

  private registerActivator = (name: ServiceActivatorType, activator: ActivatorFn): void => {
    this.activators[name] = activator;
  };

  private runActivator = async (name: ServiceActivatorType, params?: unknown): Promise<unknown> => {
    const value = await this.activators[name]?.(params);
    value && this.activateEntryPoint(name);

    return value;
  };
}
