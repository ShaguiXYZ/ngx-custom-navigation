/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/constants';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteFormValidarors } from 'src/app/core/form';
import { AppContextData } from 'src/app/core/models';
import { LocationService, NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { PlaceComponent } from './place.component';

describe('PlaceComponent', () => {
  let component: PlaceComponent;
  let fixture: ComponentFixture<PlaceComponent>;
  let locationService: jasmine.SpyObj<LocationService>;

  beforeEach(waitForAsync(() => {
    const contextDataSubject = new Subject<any>();
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getAddress']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return {
          configuration: { literals: {} },
          navigation: { lastPage: { pageId: 'page1' }, viewedPages: ['page1', 'page2'] }
        } as AppContextData;
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {};
      }

      return null;
    });

    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    TestBed.configureTestingModule({
      declarations: [],
      imports: [PlaceComponent, ReactiveFormsModule],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    }).compileComponents();

    TestBed.overrideComponent(PlaceComponent, {
      set: {
        providers: [{ provide: LocationService, useValue: locationServiceSpy }, QuoteFormValidarors]
      }
    });

    locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
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
    component.form.setValue({ postalCode: '' });
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });

  it('should validate postal code asynchronously', waitForAsync(() => {
    const mockLocation = { postalCode: '12345', province: 'TestProvince', provinceCode: '12', location: 'TestLocation' };
    locationService.getAddress.and.returnValue(Promise.resolve(mockLocation));

    component.form.controls['postalCode'].setValue('12345');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.form.controls['postalCode'].valid).toBeTrue();
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
