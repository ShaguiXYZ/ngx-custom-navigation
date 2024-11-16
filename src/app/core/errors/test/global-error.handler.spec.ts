import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from '../global-error.handler';
import { ConditionError } from '../condition.error';

describe('GlobalErrorHandler', () => {
  let errorHandler: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler]
    });
    errorHandler = TestBed.inject(GlobalErrorHandler);
  });

  it('should be created', () => {
    expect(errorHandler).toBeTruthy();
  });

  it('should log the error to the console', () => {
    const consoleSpy = spyOn(console, 'error');
    const error = new Error('Test error');

    errorHandler.handleError(error);

    // expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('shold log the condition error to the console', () => {
    const consoleGroupSpy = spyOn(console, 'group');
    const consoleErrorSpy = spyOn(console, 'error');
    const conditionError = new ConditionError('Test condition error', { expression: 'age', operation: '>', value: 18 });

    errorHandler.handleError(conditionError);

    expect(consoleGroupSpy).toHaveBeenCalled();
    expect(consoleGroupSpy).toHaveBeenCalledWith('ConditionError');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
