import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { AppContextData } from '../../models';
import { QuoteService } from '../quote.service';

describe('QuoteService', () => {
  let service: QuoteService;
  let appContextData: AppContextData;
  let dataChangeSubject: Subject<AppContextData>;

  beforeEach(() => {
    dataChangeSubject = new Subject<AppContextData>();
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

    const spy = jasmine.createSpyObj('ContextDataService', ['get', 'onDataChange']);
    spy.get.and.returnValue(appContextData);
    spy.onDataChange.and.returnValue(dataChangeSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [QuoteService, { provide: ContextDataService, useValue: spy }]
    });

    service = TestBed.inject(QuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(service['subscription'], 'unsubscribe');
    service.ngOnDestroy();

    expect(service['subscription'].unsubscribe).toHaveBeenCalled();
  });
});
