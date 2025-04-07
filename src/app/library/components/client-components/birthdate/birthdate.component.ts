import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule, NxDatepickerIntl } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxIsoDateModule } from '@aposin/ng-aquila/iso-date-adapter';
import dayjs, { Dayjs } from 'dayjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { DatePikerIntl } from 'src/app/library/services/i18n';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-birthdate',
  templateUrl: './birthdate.component.html',
  styleUrl: './birthdate.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxDatefieldModule,
    NxFormfieldModule,
    NxInputModule,
    NxIsoDateModule,
    ReactiveFormsModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [QuoteFormValidarors, { provide: NxDatepickerIntl, useClass: DatePikerIntl }]
})
export class BirthdateComponent extends QuoteComponent<QuoteModel> {
  public readonly maxDate = dayjs();
  public maxDate__Date!: Date;
  public minDate__Date!: Date;
  public form!: FormGroup;
  public minValue = 18;
  public maxValue = 70;

  private birthdateFromContext: Dayjs | undefined;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = (): void => {
    this.maxDate__Date = this.maxDate.subtract(this.minValue, 'y').toDate();
    this.minDate__Date = this.maxDate.subtract(this.maxValue, 'y').toDate();

    this.createForm();
  };

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.personalData = {
        ...this._contextData.personalData,
        ...this.form.value,
        birthdate: dayjs(new Date(this.form.controls['birthdate'].value)).format(DEFAULT_DATE_FORMAT)
      };
    }
  };

  private createForm() {
    if (this._contextData.personalData.birthdate) {
      this.birthdateFromContext = dayjs(new Date(this._contextData.personalData.birthdate));
    }

    this.form = this.fb.group({
      birthdate: [
        this.birthdateFromContext?.toDate(),
        [
          this.quoteFormValidarors.required(),
          this.quoteFormValidarors.isOlderThanYears(this.minValue),
          this.quoteFormValidarors.isYoungerThanYears(this.maxValue)
        ]
      ]
    });
  }
}
