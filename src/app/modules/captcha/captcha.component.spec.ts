import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaptchaComponent } from './captcha.component';
import { ColorCaptchaComponent, HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

describe('CaptchaComponent', () => {
  let component: CaptchaComponent;
  let fixture: ComponentFixture<CaptchaComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const contextDataSubject = new Subject<any>();
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CaptchaComponent, ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify captcha and update context data', () => {
    const appContextData = {
      settings: {
        commercialExceptions: {}
      }
    } as AppContextData;
    contextDataService.get.and.returnValue(appContextData);

    component.onCaptchaVerified(true);

    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
    expect(appContextData.settings.commercialExceptions?.captchaVerified).toBeTrue();
    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, appContextData);
  });

  it('should update context data with captchaVerified as false', () => {
    const appContextData = {
      settings: {
        commercialExceptions: {}
      }
    } as AppContextData;
    contextDataService.get.and.returnValue(appContextData);

    component.onCaptchaVerified(false);

    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
    expect(appContextData.settings.commercialExceptions?.captchaVerified).toBeFalse();
    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, appContextData);
  });
});
