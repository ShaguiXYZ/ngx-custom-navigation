import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import moment, { DurationInputArg2, Moment } from 'moment';
import { QuoteComponent } from 'src/app/core/components';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMATS, DEFAULT_DISPLAY_DATE_FORMAT } from 'src/app/core/constants';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
    selector: 'quote-date-of-issue',
    templateUrl: './date-of-issue.component.html',
    styleUrl: './date-of-issue.component.scss',
    imports: [
        HeaderTitleComponent,
        NxDatefieldModule,
        NxFormfieldModule,
        NxInputModule,
        NxMomentDateModule,
        QuoteFooterComponent,
        ReactiveFormsModule,
        QuoteAutoFocusDirective,
        QuoteLiteralDirective,
        QuoteLiteralPipe
    ],
    providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }, QuoteFormValidarors]
})
export class DateOfIssueComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public readonly dateFormat = DEFAULT_DATE_FORMAT;
  public readonly displayDateFormat = DEFAULT_DISPLAY_DATE_FORMAT;
  public readonly dateFormats = DEFAULT_DATE_FORMATS;
  public form!: FormGroup;
  public expirationInfo: { unit: DurationInputArg2; value: number } = {
    value: 1,
    unit: 'y'
  };
  public maxDays = 90;
  public minDate = moment();
  public maxDate = moment().add(this.maxDays, 'days');

  private dateOfIssueFromContext: Moment | undefined;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const dateOfIssue = moment(new Date(this.form.controls['dateOfIssue'].value));
      const expiration = moment(dateOfIssue).add(this.expirationInfo.value, this.expirationInfo.unit);

      this._contextData.client = {
        ...this._contextData.client,
        ...this.form.value,
        dateOfIssue: dateOfIssue.format(DEFAULT_DATE_FORMAT),
        expiration: expiration.format(DEFAULT_DATE_FORMAT)
      };
    }
  };

  private createForm() {
    if (this._contextData.client.dateOfIssue) {
      this.dateOfIssueFromContext = moment(new Date(this._contextData.client.dateOfIssue));
    }
    this.form = this.fb.group({
      dateOfIssue: new FormControl(this.dateOfIssueFromContext, [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.betweenDates(this.minDate.toDate(), this.maxDate.toDate())
      ])
    });
  }
}
