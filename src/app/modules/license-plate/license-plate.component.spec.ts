import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { LicensePlateComponent } from './license-plate.component';

describe('LicensePlateComponent', () => {
  let component: any;
  let fixture: ComponentFixture<LicensePlateComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);

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
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensePlateComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    // contextDataService.get.and.returnValue({ driven: {}, vehicle: {} });
    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      driven: {},
      vehicle: {
        plateNumber: '1234-SSS'
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.plateNumber).toBe('1234-SSS');
  });

  it('should mark form as touched and update context data on valid form', () => {
    let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.setValue({ plateNumber: '1234-SSS' });
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalled();
  });

  it('should not update context data on invalid form', () => {
    let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.setValue({ plateNumber: '' });
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(setContextDataSpy).not.toHaveBeenCalled();
  });

  it('should call nextStep on continueWithOutLicensePlate', () => {
    component.continueWithOutLicensePlate();

    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    component['subscription$'] = [subscription];
    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call searchVehicle on keyup event in search input', fakeAsync((done: any) => {
    let searchVehicleSpy = spyOn(component, 'searchVehicle');

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new Event('keyup'));

    // fixture.whenStable().then(() => {
    //   expect(searchVehicleSpy).toHaveBeenCalled();
    // });

    fixture.detectChanges();

    tick(DEBOUNCE_TIME);

    expect(searchVehicleSpy).toHaveBeenCalled();
  }));
});
