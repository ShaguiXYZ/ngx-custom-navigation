import { inject, Injectable } from '@angular/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, QuoteControlModel } from '../models';
import { ActivatorFn, Activators, EntryPoint, ServiceActivatorType } from './quote-activator.model';
import { NX_WORKFLOW_TOKEN } from '../components/models';

@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private activators: Record<string, ActivatorFn> = {};

  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);

  constructor() {
    Object.entries(Activators).forEach(
      ([name, serviceActivatorFn]) =>
        serviceActivatorFn &&
        this.registerActivator(
          name as ServiceActivatorType,
          serviceActivatorFn({ contextDataService: this.contextDataService, httpService: this.httpService })
        )
    );

    Object.entries(this.workFlowToken.manifest.serviceActivators ?? {}).forEach(
      ([name, serviceActivatorFn]) =>
        serviceActivatorFn &&
        this.registerActivator(
          name as ServiceActivatorType,
          serviceActivatorFn({ contextDataService: this.contextDataService, httpService: this.httpService })
        )
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

  private registerActivator = (name: ServiceActivatorType, activator: ActivatorFn): void => {
    this.activators[name] = activator;
  };

  private runActivator = (name: ServiceActivatorType, params?: unknown): Promise<unknown> =>
    this.activators[name]?.(params).then(value => value && this.activateEntryPoint(name));
}
