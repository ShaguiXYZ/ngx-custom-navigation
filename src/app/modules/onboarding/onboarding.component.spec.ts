import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { OnboardingComponent } from './onboarding.component';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        OnboardingComponent,
        HeaderTitleComponent,
        QuoteFooterComponent,
        NxButtonModule,
        NxCardModule,
        NxCopytextModule,
        NxHeadlineModule,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have footerConfig with showNext set to true', () => {
    expect(component.footerConfig.showNext).toBeTrue();
  });

  it('should call routingService.nextStep when goToNextStep is called', () => {
    component.goToNextStep();
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should render HeaderTitleComponent', () => {
    const headerTitleElement = fixture.debugElement.query(By.directive(HeaderTitleComponent));
    expect(headerTitleElement).toBeTruthy();
  });

  it('should render QuoteFooterComponent', () => {
    const quoteFooterElement = fixture.debugElement.query(By.directive(QuoteFooterComponent));
    expect(quoteFooterElement).toBeTruthy();
  });
});
