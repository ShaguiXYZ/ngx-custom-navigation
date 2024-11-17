import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import moment, { Moment } from 'moment';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMATS } from 'src/app/core/constants';
import { isFutureDate, minYearsBetweenDates } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { TrackInfo } from 'src/app/core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-driving-license-date',
  templateUrl: './driving-license-date.component.html',
  styleUrl: './driving-license-date.component.scss',
  imports: [
    HeaderTitleComponent,
    NxDatefieldModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteFooterComponent,
    NxMomentDateModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }],
  standalone: true
})
export class DrivingLicenseDateComponent extends QuoteComponent implements OnInit {
  public dateFormats = DEFAULT_DATE_FORMATS;
  public form!: FormGroup;
  public maxDate = moment();
  public minYears = 18;

  private drivingLicenseDateFromContext?: Moment;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public get trackInfo(): Partial<TrackInfo> {
    return {
      ...this._trackInfo,
      label: this.quoteLiteral.transform('footer-next'),
      title: this.quoteLiteral.transform('header'),
      drivenLicenseDate: this.form.controls['licenseDate'].value?.format(DEFAULT_DATE_FORMAT)
    };
  }

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.driven = {
        ...this._contextData.driven,
        ...this.form.value,
        licenseDate: moment(new Date(this.form.controls['licenseDate'].value)).format(DEFAULT_DATE_FORMAT)
      };
    }
  };

  private createForm() {
    if (this._contextData.driven.licenseDate) {
      this.drivingLicenseDateFromContext = moment(new Date(this._contextData.driven.licenseDate));
    }

    const birthdate = moment(this._contextData.personalData.birthdate).toDate();

    this.form = this.fb.group(
      {
        licenseDate: new FormControl(this.drivingLicenseDateFromContext, [
          Validators.required,
          isFutureDate(),
          minYearsBetweenDates(birthdate, this.minYears)
        ])
      },
      { updateOn: 'blur' }
    );
  }
}
