import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { NxMaskModule } from '@allianz/ng-aquila/mask';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxDate } from '@shagui/ng-shagui/core';
import dayjs from 'dayjs';
import { QuoteComponent } from '../../../../core/components';
import { QuoteFormValidarors } from '../../../../core/form';
import { HeaderTitleComponent, QuoteFooterComponent } from '../../../../shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [QuoteFormValidarors]
})
export class LicenseYearComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public maxYearsOld = 50;
  public minYear!: number;
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = this.createForm.bind(this);

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
      yearOfManufacture: [
        this._contextData.vehicle.yearOfManufacture,
        [
          this.quoteFormValidarors.required(),
          this.quoteFormValidarors.minValues(this.minYear),
          this.quoteFormValidarors.maxValues(dayjs().year())
        ]
      ]
    });
  }
}
