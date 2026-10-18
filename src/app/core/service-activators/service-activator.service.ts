import { inject, Injectable } from '@angular/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from '../components/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, QuoteControlModel } from '../models';
import { QuoteTrackService } from '../tracking';
import { Activator, ActivatorFn, EntryPoint, QUOTE_ACTIVATORS } from './quote-activator.model';

/**
 * Coordinates the execution of service activators for the current page.
 * Combines the built-in activators with those declared in the workflow
 * manifest and, when given an entry point, executes the configurations on
 * the last page whose name matches and whose conditions are met.
 */
@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private readonly activators: Partial<Record<EntryPoint, ActivatorFn>> = {};

  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly trackService = inject(QuoteTrackService);

  /** Registers the built-in activators and those declared in the manifest. */
  constructor() {
    const registerActivators = (activator: Activator): void => {
      Object.entries(activator).forEach(([name, serviceActivatorFn]) => {
        serviceActivatorFn &&
          this.registerActivator(
            name as EntryPoint,
            serviceActivatorFn({
              contextDataService: this.contextDataService,
              httpService: this.httpService,
              trackService: this.trackService
            })
          );
      });
    };

    registerActivators(QUOTE_ACTIVATORS);
    registerActivators(this.workFlowToken.manifest.serviceActivators ?? {});
  }

  /**
   * Executes the configurations for the given entry point on the last page.
   * If there is no last page, or no configuration meets its conditions, no
   * activator is executed. Matching configurations are processed in parallel.
   * @param name Name of the entry point to activate.
   */
  public activateEntryPoint = async (name: EntryPoint): Promise<void> => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (!lastPage) {
      return;
    }

    const entryPoints = lastPage.configuration?.serviceActivators?.filter(sa => sa.entryPoint === name);

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

  /** Stores the function that implements an entry point. */
  private registerActivator = (name: EntryPoint, activator: ActivatorFn): void => {
    this.activators[name] = activator;
  };

  /**
   * Executes the registered function and returns its result. If the result is
   * truthy, activates the entry point with the same name again.
   * @param name Entry point whose function will be executed.
   * @param params Optional parameters passed to the function.
   * @returns The activator result, or `undefined` if it is not registered.
   */
  private runActivator = async (name: EntryPoint, params?: unknown): Promise<unknown> => {
    const value = await this.activators[name]?.(params);
    value && this.activateEntryPoint(name);

    return value;
  };
}
