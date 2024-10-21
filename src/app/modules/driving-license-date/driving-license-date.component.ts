import { Component, OnInit, inject } from '@angular/core';
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
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';
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
export class DrivingLicenseDateComponent implements OnInit, IsValidData {
  public form!: FormGroup;
  public drivingLicenseDateFromContext?: Moment;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.createForm();
  }

  public canDeactivate = (): boolean => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.driven = {
        ...this.contextData.driven,
        ...this.form.value,
        drivenLicenseDate: moment(new Date(this.form.controls['drivenLicenseDate'].value)).format('YYYY-MM-DD')
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    if (this.contextData.driven.drivenLicenseDate) {
      this.drivingLicenseDateFromContext = moment(new Date(this.contextData.driven.drivenLicenseDate));
    }

    this.form = this.fb.group({
      drivenLicenseDate: new FormControl(this.drivingLicenseDateFromContext, [Validators.required])
    });
  }
}
