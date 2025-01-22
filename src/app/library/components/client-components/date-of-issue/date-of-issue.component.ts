import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxIsoDateModule } from '@aposin/ng-aquila/iso-date-adapter';
import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
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
  providers: [QuoteFormValidarors]
})
export class DateOfIssueComponent extends QuoteComponent<QuoteModel> {
  public readonly maxDays = 90;
  public readonly minDate = dayjs();
  public readonly maxDate = dayjs().add(this.maxDays, 'days');
  public form!: FormGroup;

  private expirationInfo: { value: number; unit: ManipulateType } = { value: 1, unit: 'y' };
  private dateOfIssueFromContext: Dayjs | undefined;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = this.createForm.bind(this);

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const dateOfIssue = dayjs(new Date(this.form.controls['dateOfIssue'].value));
      const expiration = dayjs(dateOfIssue).add(this.expirationInfo.value, this.expirationInfo.unit);

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
      this.dateOfIssueFromContext = dayjs(new Date(this._contextData.client.dateOfIssue));
    }

    this.form = this.fb.group({
      dateOfIssue: new FormControl(this.dateOfIssueFromContext?.toDate(), [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.betweenDates(this.minDate.toDate(), this.maxDate.toDate())
      ])
    });
  }
}
