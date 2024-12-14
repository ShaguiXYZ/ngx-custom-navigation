import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { AppContextData, Stepper } from 'src/app/core/models';
import { QuoteStepperService } from './quote-stepper.service';

describe('QuoteStepperService', () => {
  let service: QuoteStepperService;
  let contextDataSubject: Subject<any>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    contextDataSubject = new Subject<AppContextData>();

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

  it('should update quoteSteps$ when context data changes', done => {
    const mockStepper: Stepper = { steps: [{ key: 'step1', label: 'step1', pages: ['page1'] }] };
    const mockAppContextData: AppContextData = {
      navigation: { lastPage: { pageId: 'page1' } },
      configuration: {
        pageMap: {
          page1: { stepper: { key: 'stepper1', stepKey: 'step1' } }
        },
        steppers: {
          stepper1: mockStepper
        }
      }
    } as unknown as AppContextData;

    service.asObservable().subscribe(value => {
      expect(value).toEqual({ stepper: mockStepper, stepKey: 'step1' });
      done();
    });

    contextDataSubject.next(mockAppContextData);
  });

  it('should set quoteSteps$ to undefined if pageId is not present', done => {
    const mockAppContextData: AppContextData = {
      navigation: { lastPage: null },
      configuration: { pageMap: {}, steppers: {} }
    } as unknown as AppContextData;

    service.asObservable().subscribe(value => {
      expect(value).toBeUndefined();
      done();
    });

    contextDataSubject.next(mockAppContextData);
  });

  it('should set quoteSteps$ to undefined if stepper is not present in page', done => {
    const mockAppContextData: AppContextData = {
      navigation: { lastPage: { pageId: 'page1' } },
      configuration: {
        pageMap: { page1: {} },
        steppers: {}
      }
    } as unknown as AppContextData;

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
