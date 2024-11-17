import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { LicensePlateComponent } from './license-plate.component';

describe('LicensePlateComponent', () => {
  let component: LicensePlateComponent;
  let fixture: ComponentFixture<LicensePlateComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        LicensePlateComponent,
        ReactiveFormsModule,
        NxButtonModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        NxLicencePlateModule,
        NxMaskModule,
        QuoteFooterComponent,
        QuoteFooterInfoComponent,
        HeaderTitleComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensePlateComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = {
      driven: {
        hasDrivenLicense: true
      },
      vehicle: {
        plateNumber: '1234-SSS'
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    component['_contextData'] = {
      driven: {
        hasDrivenLicense: true
      },
      vehicle: {
        plateNumber: '1234-SSS'
      }
    } as QuoteModel;

    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.plateNumber).toBe('1234-SSS');
  });

  it('should mark form as touched and update context data on valid form', () => {
    component.form.setValue({ plateNumber: '1234-SSS' });
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
  });

  it('should not update context data on invalid form', () => {
    component.form.setValue({ plateNumber: '' });
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
  });

  it('should call nextStep on continueWithOutLicensePlate', () => {
    component.continueWithOutLicensePlate();

    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true on canDeactivate', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false on canDeactivate', () => {
    component.form.setValue({ plateNumber: '' });
    expect(component.canDeactivate()).toBeFalse();
  });
});
