import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { AppContextData } from '../../models';
import { QuoteService } from '../quote.service';

describe('QuoteService', () => {
  let service: QuoteService;
  let appContextData: AppContextData;

  beforeEach(() => {
    appContextData = {
      navigation: {
        lastPage: {
          configuration: {
            data: { key1: 'value1' },
            literals: { literalKey: { value: 'literalValue' } }
          }
        }
      },
      configuration: {
        literals: { literalKey: { value: 'literalValue' } }
      }
    } as unknown as AppContextData;

    const dataChangeSubject = new Subject<AppContextData>();
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'onDataChange']);
    contextDataServiceSpy.onDataChange.and.returnValue(dataChangeSubject.asObservable());
    contextDataServiceSpy.get.and.returnValue(appContextData);

    TestBed.configureTestingModule({
      providers: [QuoteService, { provide: ContextDataService, useValue: contextDataServiceSpy }]
    });

    service = TestBed.inject(QuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
