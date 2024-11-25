import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { LicenseYearComponent } from './license-year.component';

describe('LicenseYearComponent', () => {
  let component: LicenseYearComponent;
  let fixture: ComponentFixture<LicenseYearComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [LicenseYearComponent, CommonModule, ReactiveFormsModule, NxFormfieldModule, NxInputModule, NxMaskModule, NxButtonModule],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseYearComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      vehicle: { yearOfManufacture: 2020 },
      driven: { hasDrivenLicense: true }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with context data', () => {
    expect(component.form.value.yearOfManufacture).toBe(2020);
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    component.form.controls['yearOfManufacture'].setValue(2021);
    const markAllAsTouchedSpy = spyOn(component.form, 'markAllAsTouched');

    component.updateValidData();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(component.form.valid).toBeTrue();
    });
  });

  it('should not update context data if form is invalid', () => {
    component.form.controls['yearOfManufacture'].setValue('');

    expect(component.form.valid).toBeFalse();
  });

  it('should allow deactivation if form is valid', () => {
    component.form.controls['yearOfManufacture'].setValue(2021);
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeTrue();
  });

  it('should not allow deactivation if form is invalid', () => {
    component.form.controls['yearOfManufacture'].setValue('');
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeFalse();
  });
});
