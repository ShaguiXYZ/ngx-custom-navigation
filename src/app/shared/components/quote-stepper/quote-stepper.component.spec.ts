import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxTooltipModule } from '@aposin/ng-aquila/tooltip';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { Step, Stepper } from 'src/app/core/models';
import { LiteralToStringPipe } from '../../pipes';
import { QuoteStepperComponent } from './quote-stepper.component';
import { QuoteStepperService } from './services';

describe('QuoteStepperComponent', () => {
  let component: QuoteStepperComponent;
  let fixture: ComponentFixture<QuoteStepperComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let quoteStepperService: jasmine.SpyObj<QuoteStepperService>;

  beforeEach(async () => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const quoteStepperServiceSpy = jasmine.createSpyObj('QuoteStepperService', ['asObservable', 'goToStep']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteStepperComponent, CommonModule, NxCopytextModule, NxIconModule, NxTooltipModule, LiteralToStringPipe],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: QuoteStepperService, useValue: quoteStepperServiceSpy }
      ]
    }).compileComponents();

    // @howto - Override component providers in TestBed
    TestBed.overrideComponent(QuoteStepperComponent, {
      set: {
        providers: [LiteralToStringPipe, { provide: QuoteStepperService, useValue: quoteStepperServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteStepperComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    quoteStepperService = TestBed.inject(QuoteStepperService) as jasmine.SpyObj<QuoteStepperService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stepper data on init', () => {
    const mockStepper: Stepper = {
      steps: [
        { key: 'step1', pages: ['page1'] },
        { key: 'step2', pages: ['page2'] }
      ]
    } as Stepper;
    const mockData = { stepper: mockStepper, stepKey: 'step1' };

    quoteStepperService.asObservable.and.returnValue(of(mockData));
    contextDataService.get.and.returnValue({ navigation: { lastPage: { configuration: { data: { stepperConfig: { label: 'test' } } } } } });

    component.ngOnInit();

    expect(contextDataService.get).toHaveBeenCalled();
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
    const mockStep = { key: 'step1', pages: ['page1'] } as Step;

    component.onStepClick(mockStep);

    expect(quoteStepperService.goToStep).toHaveBeenCalledWith(mockStep);
  });
});
