import { ErrorHandler } from '@angular/core';

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error(`Error ${error.name}:`, error.stack);
  }
}
