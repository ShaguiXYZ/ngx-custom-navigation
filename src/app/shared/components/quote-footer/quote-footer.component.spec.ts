import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteFooterConfig } from './models';
import { QuoteFooterComponent } from './quote-footer.component';
import { QuoteFooterService } from './services';

describe('QuoteFooterComponent', () => {
  let component: QuoteFooterComponent;
  let fixture: ComponentFixture<QuoteFooterComponent>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let quoteFooterService: jasmine.SpyObj<QuoteFooterService>;

  beforeEach(async () => {
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const quoteFooterServiceSpy = jasmine.createSpyObj('QuoteFooterService', ['nextStep', 'previousStep']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteFooterComponent],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: QuoteFooterService, useValue: quoteFooterServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    // @howto - Override component providers in TestBed
    TestBed.overrideComponent(QuoteFooterComponent, {
      set: {
        providers: [{ provide: QuoteFooterService, useValue: quoteFooterServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteFooterComponent);
    component = fixture.componentInstance;

    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    quoteFooterService = TestBed.inject(QuoteFooterService) as jasmine.SpyObj<QuoteFooterService>;

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

  it('should call nextStep on goToNextStep', () => {
    component.goToNextStep();

    expect(quoteFooterService.nextStep).toHaveBeenCalledWith(component.config);
  });

  it('should call previousStep on goToPreviousStep', () => {
    component.goToPreviousStep();

    expect(quoteFooterService.previousStep).toHaveBeenCalled();
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
