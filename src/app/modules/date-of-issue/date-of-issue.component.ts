import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import moment, { DurationInputArg2, Moment } from 'moment';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
import { isBetweenDates } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-date-of-issue',
  templateUrl: './date-of-issue.component.html',
  styleUrl: './date-of-issue.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    NxDatefieldModule,
    NxFormfieldModule,
    NxInputModule,
    NxMomentDateModule,
    QuoteFooterComponent,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class DateOfIssueComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;
  public expirationInfo: { unit: DurationInputArg2; value: number } = {
    value: 1,
    unit: 'y'
  };
  public maxDays = 90;
  public minDate = moment();
  public maxDate = moment().add(this.maxDays, 'days');

  private dateOfIssueFromContext: Moment | undefined;

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

      this.contextData.client = {
        ...this.contextData.client,
        ...this.form.value,
        dateOfIssue: dateOfIssue.format(DEFAULT_DATE_FORMAT),
        expiration: expiration.format(DEFAULT_DATE_FORMAT)
      };
    }
  };

  private createForm() {
    if (this.contextData.client.dateOfIssue) {
      this.dateOfIssueFromContext = moment(new Date(this.contextData.client.dateOfIssue));
    }
    this.form = this.fb.group({
      dateOfIssue: new FormControl(this.dateOfIssueFromContext, [
        Validators.required,
        isBetweenDates(this.minDate.toDate(), this.maxDate.toDate())
      ])
    });
  }
}
