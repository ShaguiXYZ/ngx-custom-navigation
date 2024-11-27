import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxDate } from '@shagui/ng-shagui/core';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-license-year',
  templateUrl: './license-year.component.html',
  styleUrl: './license-year.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    NxButtonModule,
    QuoteFooterComponent,
    ReactiveFormsModule,
    CommonModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [QuoteFormValidarors]
})
export class LicenseYearComponent extends QuoteComponent implements OnInit {
  public maxYearsOld = 50;
  public minYear!: number;
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.minYear = new NxDate().getFullYear() - this.maxYearsOld;
    this.createForm();
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
        this.quoteFormValidarors.minValues(this.minYear)
      ])
    });
  }
}
