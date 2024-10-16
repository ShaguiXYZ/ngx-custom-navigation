import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { BehaviorSubject } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { AppContextData } from 'src/app/core/models';
import { Stepper } from 'src/app/shared/models/stepper.model';
import { QuoteStepperService } from './quote-stepper.service';

describe('QuoteStepperService', () => {
  let service: QuoteStepperService;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuoteStepperService, { provide: ContextDataService, useClass: ContextDataServiceMock }]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(QuoteStepperService);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
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

    contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockAppContextData);

    const contextDataSubject = new BehaviorSubject<AppContextData>(mockAppContextData);
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['onDataChange']);
    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    service.asObservable().subscribe(value => {
      expect(value).toEqual({ stepper: mockStepper, stepKey: 'step1' });
      done();
    });

    contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockAppContextData);
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
