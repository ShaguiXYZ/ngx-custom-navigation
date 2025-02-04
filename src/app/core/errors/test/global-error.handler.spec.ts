import { HttpStatusCode } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { AppContextData } from '../../models';
import { RoutingService } from '../../services';
import { ConditionError } from '../condition.error';
import { GlobalErrorHandler } from '../global-error.handler';
import { HttpError } from '../http.error';
import { TrackError } from '../track.error';

describe('GlobalErrorHandler', () => {
  let errorHandler: GlobalErrorHandler;
  let httpMock: HttpTestingController;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    routingServiceSpy = jasmine.createSpyObj('RoutingService', ['goToPage']);
    contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);

    contextDataServiceSpy.get.and.returnValue({ configuration: { errorPageId: 'errorPageId' } } as AppContextData);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        provideHttpClientTesting(),
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useValue: contextDataServiceSpy }
      ]
    });
    errorHandler = TestBed.inject(GlobalErrorHandler);
    httpMock = TestBed.inject(HttpTestingController);

    routingServiceSpy.goToPage.and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    httpMock.verify();
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
    const consoleGroupSpy = spyOn(console, 'groupCollapsed');
    const consoleErrorSpy = spyOn(console, 'error');
    const conditionError = new ConditionError('Test condition error', { expression: 'age', operation: '>', value: 18 });

    errorHandler.handleError(conditionError);

    expect(consoleGroupSpy).toHaveBeenCalled();
    expect(consoleGroupSpy).toHaveBeenCalledWith('ConditionError');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('shold log the track error to the console', () => {
    const consoleGroupSpy = spyOn(console, 'groupCollapsed');
    const consoleErrorSpy = spyOn(console, 'error');
    const trackError = new TrackError('Test track error', 'Test event');

    errorHandler.handleError(trackError);

    expect(consoleGroupSpy).toHaveBeenCalled();
    expect(consoleGroupSpy).toHaveBeenCalledWith('TrackError');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('shold log the http error to the console', () => {
    const consoleGroupSpy = spyOn(console, 'groupCollapsed');
    const consoleErrorSpy = spyOn(console, 'error');
    const httpError = new HttpError(HttpStatusCode.NotFound, 'Not Found', 'http://test.com', 'GET');

    errorHandler.handleError(httpError);

    expect(consoleGroupSpy).toHaveBeenCalled();
    expect(consoleGroupSpy).toHaveBeenCalledWith('HttpError');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
