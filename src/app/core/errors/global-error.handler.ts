import { ErrorHandler, inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { AppContextData } from '../models';
import { RoutingService } from '../services';
import { _Error } from './_error.model';
import { ConditionError } from './condition.error';
import { HttpError } from './http.error';
import { TrackError } from './track.error';

export class GlobalErrorHandler implements ErrorHandler {
  private contextDataService = inject(ContextDataService);
  private routingService = inject(RoutingService);

  handleError(error: Error): void {
    if (error instanceof _Error) {
      this.handleCustomError(error);

      if (error.critical) {
        this.handleCriticalError();
      }

      return;
    }

    console.error('An error occurred:', error);
  }

  private handleCustomError(error: _Error): void {
    const errorHandlers = {
      BudgetError: () => {
        console.groupCollapsed('BudgetError');
        console.error(`Error retrieving budget: ${error.message}`);
        console.groupEnd();
      },
      ConditionError: () => {
        console.groupCollapsed('ConditionError');
        console.error(`Error evaluating condition: ${error}`);
        console.error(`Condition: ${JSON.stringify((error as ConditionError).condition)}`);
        console.groupEnd();
      },
      HttpError: () => {
        const httpError = error as HttpError;
        console.groupCollapsed('HttpError');
        console.error(`Error making HTTP request: ${httpError.message}`);
        console.error(`Status: ${httpError.status}`);
        httpError.url && console.error(`URL: ${httpError.url}`);
        httpError.method && console.error(`Method: ${httpError.method}`);
        console.groupEnd();
      },
      QuoteError: () => {
        console.groupCollapsed('QuoteError');
        console.error(`Workflow error: ${error.message}`);
        console.groupEnd();
      },
      TrackError: () => {
        console.groupCollapsed('TrackError');
        console.error(`Error tracking event: ${(error as TrackError).event}`);
        console.groupEnd();
      }
    };

    const errorType = error.constructor.name as keyof typeof errorHandlers;

    if (errorHandlers[errorType]) {
      errorHandlers[errorType]();
    }
  }

  private handleCriticalError(): void {
    const {
      configuration: { errorPageId }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.routingService.goToPage(errorPageId).catch(console.error);
  }
}
