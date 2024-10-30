import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment, { Moment } from 'moment';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from 'src/app/core/models';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-date-of-issue',
  templateUrl: './date-of-issue.component.html',
  styleUrl: './date-of-issue.component.scss',
  standalone: true,
  imports: [
    FormsModule,
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
  public dateOfIssueFromContext: Moment | undefined;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.client = {
        ...this.contextData.client,
        ...this.form.value,
        dateOfIssue: moment(new Date(this.form.controls['dateOfIssue'].value)).format('YYYY-MM-DD')
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    if (this.contextData.client.dateOfIssue) {
      this.dateOfIssueFromContext = moment(new Date(this.contextData.client.dateOfIssue));
    }
    this.form = this.fb.group({
      dateOfIssue: new FormControl(this.dateOfIssueFromContext, [Validators.required])
    });
  }
}
