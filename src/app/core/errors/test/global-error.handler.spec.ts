import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from '../global-error.handler';

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

    expect(consoleSpy).toHaveBeenCalledWith(error);
  });
});
