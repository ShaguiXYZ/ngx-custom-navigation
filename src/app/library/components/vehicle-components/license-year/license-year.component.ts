import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxDate } from '@shagui/ng-shagui/core';
import dayjs from 'dayjs';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-license-year',
  templateUrl: './license-year.component.html',
  styleUrl: './license-year.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    NxButtonModule,
    ReactiveFormsModule,
    CommonModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [QuoteFormValidarors]
})
export class LicenseYearComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public maxYearsOld = 50;
  public minYear!: number;
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngQuoteInit = this.createForm.bind(this);

  ngOnInit(): void {
    this.minYear = new NxDate().getFullYear() - this.maxYearsOld;
  }

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.vehicle.yearOfManufacture = this.form.value.yearOfManufacture;
    }
  };

  private createForm() {
    this.form = this.fb.group({
      yearOfManufacture: new FormControl(this._contextData.vehicle.yearOfManufacture, [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.minValues(this.minYear),
        this.quoteFormValidarors.maxValues(dayjs().year())
      ])
    });
  }
}
