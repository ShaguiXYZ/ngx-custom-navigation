import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import moment, { Moment } from 'moment';
import { isFutureDate, minYearsBetweenDates } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-driving-license-date',
  templateUrl: './driving-license-date.component.html',
  styleUrl: './driving-license-date.component.scss',
  standalone: true,
  imports: [
    FormsModule,
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
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class DrivingLicenseDateComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;
  public minYears = 18;

  private drivingLicenseDateFromContext?: Moment;
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.driven = {
        ...this.contextData.driven,
        ...this.form.value,
        drivenLicenseDate: moment(new Date(this.form.controls['drivenLicenseDate'].value)).format('YYYY-MM-DD')
      };

      this.populateContextData();
    }

    return this.form.valid;
  };

  private createForm() {
    if (this.contextData.driven.drivenLicenseDate) {
      this.drivingLicenseDateFromContext = moment(new Date(this.contextData.driven.drivenLicenseDate));
    }

    const birthdate = moment(this.contextData.personalData.birthdate).toDate();

    this.form = this.fb.group({
      drivenLicenseDate: new FormControl(this.drivingLicenseDateFromContext, [
        Validators.required,
        isFutureDate(),
        minYearsBetweenDates(birthdate, this.minYears)
      ])
    });
  }
}
