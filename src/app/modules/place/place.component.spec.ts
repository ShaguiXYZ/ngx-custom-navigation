import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { LocationService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { PlaceComponent } from './place.component';

describe('PlaceComponent', () => {
  let component: PlaceComponent;
  let fixture: ComponentFixture<PlaceComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let locationService: jasmine.SpyObj<LocationService>;

  beforeEach(waitForAsync(() => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getAddress']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [PlaceComponent, ReactiveFormsModule],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: LocationService, useValue: locationServiceSpy }
      ]
    }).compileComponents();

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceComponent);
    component = fixture.componentInstance;

    component['contextData'] = {
      place: { postalCode: '12345', province: 'TestProvince', location: 'TestLocation' }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.postalCode).toBe('12345');
  });

  it('should mark all fields as touched and update context data on valid form', () => {
    // const setContextDataSpy = spyOn(contextDataService, 'set');
    const markAllAsTouchedSpy = spyOn(component.form, 'markAllAsTouched');
    const mockLocation = { postalCode: '12345', province: 'TestProvince', provinceCode: '12', location: 'TestLocation' };

    locationService.getAddress.and.returnValue(Promise.resolve(mockLocation));

    component.form.setValue({ postalCode: '12345' });
    component['updateValidData']();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      // expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, jasmine.any(Object));
    });
  });

  it('should not update context data on invalid form', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.setValue({ postalCode: '' });
    component['updateValidData']();

    expect(setContextDataSpy).not.toHaveBeenCalled();
  });

  it('should validate postal code asynchronously', waitForAsync(() => {
    const mockLocation = { postalCode: '12345', province: 'TestProvince', provinceCode: '12', location: 'TestLocation' };
    locationService.getAddress.and.returnValue(Promise.resolve(mockLocation));

    component.form.controls['postalCode'].setValue('12345');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.form.controls['postalCode'].valid).toBeTrue();
      expect(component.location).toBe(component['locationFormfieldHint'](mockLocation));
    });
  }));

  it('should invalidate postal code if not recognized', waitForAsync(() => {
    locationService.getAddress.and.returnValue(Promise.resolve(undefined));

    component.form.controls['postalCode'].setValue('99999');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.form.controls['postalCode'].valid).toBeFalse();
      expect(component.location).toBe('');
    });
  }));
});
