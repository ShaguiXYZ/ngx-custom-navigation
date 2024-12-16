import { ErrorHandler } from '@angular/core';
import { ConditionError } from './condition.error';
import { TrackError } from './track.error';
import { HttpError } from './http.error';
import { QuoteError } from './quote.error';

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    if (error instanceof ConditionError) {
      console.group('ConditionError');
      console.error(`Error evaluating condition: ${error}`);
      console.error(`Condition: ${JSON.stringify(error.condition)}`);
      console.groupEnd();

      return;
    }

    if (error instanceof HttpError) {
      console.group('HttpError');
      console.error(`Error making HTTP request: ${error.message}`);
      console.error(`Status: ${error.status}`);
      console.error(`URL: ${error.url}`);
      console.error(`Method: ${error.method}`);
      console.groupEnd();

      return;
    }

    if (error instanceof QuoteError) {
      console.group('QuoteError');
      console.error(`Workflow error: ${error.message}`);
      console.groupEnd();

      return;
    }

    if (error instanceof TrackError) {
      console.group('TrackError');
      console.error(`Error tracking event: ${error.event}`);
      console.groupEnd();

      return;
    }

    console.error('An error occurred:', error);
  }
}
