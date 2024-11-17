import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteLiteralPipe } from '../../pipes';
import { QuoteFooterConfig } from './models';
import { QuoteFooterComponent } from './quote-footer.component';

describe('QuoteFooterComponent', () => {
  let component: QuoteFooterComponent;
  let fixture: ComponentFixture<QuoteFooterComponent>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next', 'previous']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteFooterComponent],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteFooterComponent);
    component = fixture.componentInstance;

    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    const breakpointState = { matches: true, breakpoints: { HandsetPortrait: true } } as BreakpointState;
    breakpointObserver.observe.and.returnValue(of(breakpointState));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default config', () => {
    expect(component.config).toEqual({ showNext: true, showBack: false });
  });

  it('should update config when input changes', () => {
    const newConfig: QuoteFooterConfig = { showNext: false, showBack: true };
    component.config = newConfig;

    expect(component.config).toEqual(newConfig);
  });

  it('should call next on goToNextStep', () => {
    component.goToNextStep();

    expect(routingService.next).toHaveBeenCalled();
  });

  it('should call previous on goToPreviousStep', () => {
    component.goToPreviousStep();

    expect(routingService.previous).toHaveBeenCalled();
  });

  it('should observe breakpoints on init', () => {
    Breakpoints.HandsetPortrait = 'HandsetPortrait';
    breakpointObserver.observe.and.returnValue(of({ matches: true, breakpoints: { HandsetPortrait: true } }));

    component.ngOnInit();

    expect(component._observedMobileMode).toBe(true);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscription1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    const subscription2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'].push(subscription1, subscription2);
    component.ngOnDestroy();
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
  });

  it('should return mobileMode based on _mobileMode or _observedMobileMode', () => {
    component._mobileMode = undefined;
    component._observedMobileMode = true;
    expect(component.mobileMode).toBe(true);

    component._mobileMode = false;
    expect(component.mobileMode).toBe(false);
  });
});
