import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxIsoDateModule } from '@aposin/ng-aquila/iso-date-adapter';
import dayjs, { Dayjs } from 'dayjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMATS, DEFAULT_DISPLAY_DATE_FORMAT } from 'src/app/core/constants';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
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
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }, QuoteFormValidarors]
})
export class BirthdateComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public readonly dateFormat = DEFAULT_DATE_FORMAT;
  public readonly displayDateFormat = DEFAULT_DISPLAY_DATE_FORMAT;
  public readonly dateFormats = DEFAULT_DATE_FORMATS;
  public readonly maxDate = dayjs();
  public form!: FormGroup;
  public minValue = 18;
  public maxValue = 70;

  private birthdateFromContext: Dayjs | undefined;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

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
      birthdate: new FormControl(this.birthdateFromContext?.toDate(), [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.isOlderThanYears(this.minValue),
        this.quoteFormValidarors.isYoungerThanYears(this.maxValue)
      ])
    });
  }
}
