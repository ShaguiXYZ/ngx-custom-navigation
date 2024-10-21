/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { Stepper } from 'src/app/shared/models/stepper.model';
import { QuoteStepperService } from './quote-stepper.service';

describe('QuoteStepperService', () => {
  let service: QuoteStepperService;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    const contextDataSubject = new Subject<AppContextData>();
    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [QuoteStepperService, { provide: ContextDataService, useValue: contextDataServiceSpy }]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(QuoteStepperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with undefined quoteSteps$', done => {
    service.asObservable().subscribe(value => {
      expect(value).toBeUndefined();
      done();
    });
  });

  xit('should update quoteSteps$ when context data changes', done => {
    const mockStepper: Stepper = { steps: [{ key: 'step1', label: 'step1', page: 'page1' }] };
    const mockAppContextData: AppContextData = {
      navigation: { lastPage: { pageId: 'page1' } },
      configuration: {
        pageMap: {
          page1: { stepper: { key: 'stepper1', stepKey: 'step1' } }
        },
        steppers: {
          steppersMap: {
            stepper1: mockStepper
          }
        }
      }
    } as unknown as AppContextData;

    // contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
    //   if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
    //     return mockAppContextData;
    //   }

    //   return null;
    // });

    contextDataServiceSpy.onDataChange.and.callFake((contextDataKey: string): Observable<any> => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return of(mockAppContextData);
      }

      return new Subject<AppContextData>().asObservable();
    });

    service.asObservable().subscribe(value => {
      expect(value).toEqual({ stepper: mockStepper, stepKey: 'step1' });
      done();
    });
  });

  xit('should set quoteSteps$ to undefined if pageId is not present', done => {
    const mockAppContextData: AppContextData = {
      navigation: { lastPage: null },
      configuration: { pageMap: {}, steppers: { steppersMap: {} } }
    } as unknown as AppContextData;

    const contextDataSubject = new BehaviorSubject<AppContextData>(mockAppContextData);
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['onDataChange']);
    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    service.asObservable().subscribe(value => {
      expect(value).toBeUndefined();
      done();
    });

    contextDataSubject.next(mockAppContextData);
  });

  xit('should set quoteSteps$ to undefined if stepper is not present in page', done => {
    const mockAppContextData: AppContextData = {
      navigation: { lastPage: { pageId: 'page1' } },
      configuration: {
        pageMap: { page1: {} },
        steppers: { steppersMap: {} }
      }
    } as unknown as AppContextData;

    const contextDataSubject = new BehaviorSubject<AppContextData>(mockAppContextData);
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['onDataChange']);
    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    service.asObservable().subscribe(value => {
      expect(value).toBeUndefined();
      done();
    });

    contextDataSubject.next(mockAppContextData);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = spyOn(service['subscription$'][0], 'unsubscribe');
    service.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
