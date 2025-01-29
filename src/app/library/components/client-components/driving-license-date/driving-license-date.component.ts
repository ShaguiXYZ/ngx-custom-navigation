import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxIsoDateModule } from '@aposin/ng-aquila/iso-date-adapter';
import dayjs, { Dayjs } from 'dayjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-driving-license-date',
  templateUrl: './driving-license-date.component.html',
  styleUrl: './driving-license-date.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxDatefieldModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    NxIsoDateModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [QuoteFormValidarors]
})
export class DrivingLicenseDateComponent extends QuoteComponent<QuoteModel> {
  public readonly maxDate = dayjs();
  public readonly minYears = 18;
  public maxDate__Date!: Date;
  public minDrivingYears = 1;
  public form!: FormGroup;

  private drivingLicenseDateFromContext?: Dayjs;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = (): void => {
    this.maxDate__Date = this.maxDate.subtract(this.minDrivingYears, 'y').toDate();

    this.createForm();
  };

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.driven = {
        ...this._contextData.driven,
        ...this.form.value,
        licenseDate: dayjs(new Date(this.form.controls['licenseDate'].value)).format(DEFAULT_DATE_FORMAT)
      };
    }
  };

  private createForm() {
    if (this._contextData.driven.licenseDate) {
      this.drivingLicenseDateFromContext = dayjs(new Date(this._contextData.driven.licenseDate));
    }

    const birthdate = dayjs(this._contextData.personalData.birthdate).toDate();

    this.form = this.fb.group({
      licenseDate: new FormControl(this.drivingLicenseDateFromContext?.toDate(), [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.isFutureDate(),
        this.quoteFormValidarors.minYearsBetweenDates(birthdate, this.minYears),
        this.quoteFormValidarors.isOlderThanYears(this.minDrivingYears)
      ])
    });
  }
}
