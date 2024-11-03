import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxDate } from '@shagui/ng-shagui/core';
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
  public maxYearsOld = 50;
  public minYear!: number;
  public form!: FormGroup;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.minYear = new NxDate().getFullYear() - this.maxYearsOld;
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.vehicle.yearOfManufacture = this.form.value.yearOfManufacture;
      this.populateContextData();
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      yearOfManufacture: new FormControl(this.contextData.vehicle.yearOfManufacture, [
        Validators.required,
        this.preventFutureDate(),
        this.preventMinDate()
      ])
    });
  }

  private preventFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      Number(control.value) > new NxDate().getFullYear() ? { futureDate: true } : null;
  }

  private preventMinDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => (Number(control.value) < this.minYear ? { oldDate: true } : null);
  }
}
