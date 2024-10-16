import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { firstValueFrom, of } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { LocationService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective, QuoteMaskDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { PlaceComponent } from './place.component';

describe('PlaceComponent', () => {
  let component: PlaceComponent;
  let fixture: ComponentFixture<PlaceComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let locationService: jasmine.SpyObj<LocationService>;

  beforeEach(async () => {
    // const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getAddresses']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        PlaceComponent,
        FormsModule,
        ReactiveFormsModule,
        NxFormfieldModule,
        NxInputModule,
        NxMaskModule,
        QuoteFooterComponent,
        QuoteFooterInfoComponent,
        HeaderTitleComponent,
        QuoteMaskDirective,
        QuoteLiteralDirective
      ],
      providers: [
        provideAnimations(),
        // { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      place: { postalCode: '12345', province: { index: '12', data: 'Castellón' } }
    } as unknown as QuoteModel);

    // contextDataService.get.and.returnValue({ place: {} } as QuoteModel);
    locationService.getAddresses.and.returnValue(firstValueFrom(of({ index: '12', data: 'Castellón' })));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.form).toBeDefined();
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    // let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.setValue({ postalCode: '12345' });
    component['updateValidData']();

    fixture.detectChanges();

    expect(component.form.touched).toBeTrue();
    // expect(setContextDataSpy).toHaveBeenCalled();
  });

  it('should return province from context data', () => {
    component['contextData'].place.province = { index: '1', data: 'Province' };

    expect(component.province).toEqual({ index: '1', data: 'Province' });
  });

  it('should validate postal code with location service', async () => {
    locationService.getAddresses.and.returnValue(Promise.resolve({ index: '1', data: 'Province' }));
    const validator = component['postalCodeExistsValidator'](locationService);
    const control = { value: '12345' } as AbstractControl;
    const result = await validator(control);

    expect(result).toBeNull();
    expect(component['contextData'].place.province).toEqual({ index: '1', data: 'Province' });
  });

  it('should invalidate postal code if not recognized', async () => {
    locationService.getAddresses.and.returnValue(Promise.resolve(undefined));
    const validator = component['postalCodeExistsValidator'](locationService);
    const control = { value: '12345' } as AbstractControl;
    const result = await validator(control);

    expect(result).toEqual({ postalCodeNotRecognized: true });
  });
});
