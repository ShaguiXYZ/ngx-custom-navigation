import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { QuoteModel } from 'src/app/shared/models';
import { ContactTimeComponent } from './contact-time.component';

describe('ContactTimeComponent', () => {
  let component: ContactTimeComponent;
  let fixture: ComponentFixture<ContactTimeComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [ContactTimeComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTimeComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      contactData: {
        contactHour: '10:00'
      }
    } as unknown as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct contact hour', () => {
    expect(component.selectedHour).toBe('10:00');
  });

  it('should allow selecting an hour', () => {
    component.selectHour('14:00');
    expect(component.selectedHour).toBe('14:00');
  });

  it('should update valid data correctly', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.selectHour('15:00');
    component.updateValidData();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, {
      contactData: {
        contactHour: '15:00'
      }
    });
  });

  it('should allow deactivation if an hour is selected', () => {
    component.selectHour('16:00');
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should not allow deactivation if no hour is selected', () => {
    component.selectedHour = undefined;
    expect(component.canDeactivate()).toBeFalse();
  });
});
