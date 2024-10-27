/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouterOutlet } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, NotificationModel, NotificationService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { ContextDataServiceStub } from './core/stub';
import { RoutingService } from './core/services';
import {
  NotificationComponent,
  QuoteFooterComponent,
  QuoteHeaderComponent,
  QuoteLoadingComponent,
  QuoteStepperComponent
} from './shared/components';
import { QuoteLiteralPipe } from './shared/pipes';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    // const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'onDataChange']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['warning', 'onNotification', 'onCloseNotification']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['previousStep']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

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
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: TranslateService, useValue: translationsServiceSpy },
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

  it('should call notificationService.warning and routingService.previousStep on popstate event', () => {
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

  it('should return the length of viewedPages in slideTo method', () => {
    const result = component['slideTo']();

    expect(result).toBe(2);
  });

  it('should prepare route correctly', () => {
    const mockOutlet = { isActivated: true } as RouterOutlet;
    spyOn<any>(component, 'slideTo').and.returnValue(5);
    const result = component.prepareRoute(mockOutlet);

    expect(result).toBe(5);
  });

  it('should return undefined if outlet is not activated in prepareRoute', () => {
    const mockOutlet = { isActivated: false } as RouterOutlet;
    const result = component.prepareRoute(mockOutlet);

    expect(result).toBe(-1);
  });
});
