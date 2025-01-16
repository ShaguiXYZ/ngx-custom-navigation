import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService, NotificationModel, NotificationService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { NX_LANGUAGE_CONFIG } from './core/models';
import { NX_RECAPTCHA_TOKEN } from './core/services';
import { ContextDataServiceStub } from './core/stub';
import {
  NotificationComponent,
  QuoteFooterComponent,
  QuoteHeaderComponent,
  QuoteLoadingComponent,
  QuoteStepperComponent
} from './shared/components';
import { QuoteLiteralPipe } from './shared/pipes';
import { NX_WORKFLOW_TOKEN } from './core/components/models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['warning', 'onNotification', 'onCloseNotification']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const mockWorkflowConfig = {
      errorPageId: 'error',
      manifest: {}
    };
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        AppComponent,
        NxGridModule,
        NxLinkModule,
        NotificationComponent,
        QuoteFooterComponent,
        QuoteHeaderComponent,
        QuoteLoadingComponent,
        QuoteStepperComponent
      ],
      providers: [
        provideAnimations(),
        provideRouter([]),
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: HttpService, useValue: httpClientSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig },
        QuoteLiteralPipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    notificationService.onNotification.and.returnValue(
      of({
        title: 'title',
        description: 'description',
        type: 'info'
      } as NotificationModel)
    );

    notificationService.onCloseNotification.and.returnValue(of('notificationId'));

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call notificationService.warning on popstate event', () => {
    const event = new PopStateEvent('popstate');
    spyOn(event, 'stopPropagation');
    component.onPopState(event);

    expect(notificationService.warning).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should prevent default behavior on beforeunload event', () => {
    const event = {
      preventDefault: () => {
        return;
      }
    } as unknown as BeforeUnloadEvent;
    spyOn(event, 'preventDefault');
    component.beforeunloadHandler(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set verified to true on onCaptchaVerified', () => {
    component.onCaptchaVerified(true);

    expect(component.verified).toBeTrue();
  });

  it('should set verified to false on onCaptchaVerified', () => {
    component.onCaptchaVerified(false);

    expect(component.verified).toBeFalse();
  });
});
