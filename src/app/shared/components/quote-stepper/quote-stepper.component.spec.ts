import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxTooltipModule } from '@aposin/ng-aquila/tooltip';
import { of } from 'rxjs';
import { RoutingService } from 'src/app/core/services';
import { Step, Stepper } from '../../models/stepper.model';
import { LiteralToStringPipe } from '../../pipes';
import { QuoteStepperComponent } from './quote-stepper.component';
import { QuoteStepperService } from './services';

describe('QuoteStepperComponent', () => {
  let component: QuoteStepperComponent;
  let fixture: ComponentFixture<QuoteStepperComponent>;
  let quoteStepperService: jasmine.SpyObj<QuoteStepperService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteStepperServiceSpy = jasmine.createSpyObj('QuoteStepperService', ['asObservable']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['goToPage']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteStepperComponent, CommonModule, NxCopytextModule, NxIconModule, NxTooltipModule, LiteralToStringPipe],
      providers: [
        { provide: QuoteStepperService, useValue: quoteStepperServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(QuoteStepperComponent, {
      set: {
        providers: [LiteralToStringPipe, { provide: QuoteStepperService, useValue: quoteStepperServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteStepperComponent);
    component = fixture.componentInstance;
    quoteStepperService = TestBed.inject(QuoteStepperService) as jasmine.SpyObj<QuoteStepperService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stepper data on init', () => {
    const mockStepper: Stepper = {
      steps: [
        { key: 'step1', page: 'page1' },
        { key: 'step2', page: 'page2' }
      ]
    } as Stepper;
    const mockData = { stepper: mockStepper, stepKey: 'step1' };
    quoteStepperService.asObservable.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.stepperData).toEqual(mockData);
    expect(component.stepperIndex).toBe(0);
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    component['subscription$'].forEach(sub => {
      expect(sub.closed).toBeTrue();
    });
  });

  it('should navigate to the correct page on step click', () => {
    const mockStep = { key: 'step1', page: 'page1' } as Step;
    component.onStepClick(mockStep);

    expect(routingService.goToPage).toHaveBeenCalledWith('page1');
  });
});
