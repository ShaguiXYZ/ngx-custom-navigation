import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from 'src/app/core/models';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-license-year',
  templateUrl: './license-year.component.html',
  styleUrl: './license-year.component.scss',
  standalone: true,
  imports: [
    FormsModule,
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
  ]
})
export class LicenseYearComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public continue() {
    this.contextData.driven.hasDrivenLicense = false;

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
  }

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.vehicle.yearOfManufacture = this.form.value.yearOfManufacture;
      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      yearOfManufacture: new FormControl(this.contextData.vehicle.yearOfManufacture, [Validators.required])
    });
  }
}
