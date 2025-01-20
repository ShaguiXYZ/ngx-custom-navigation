import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { isNIF } from './models';

@Component({
  selector: 'quote-client-identification-number',
  templateUrl: './client-identification-number.component.html',
  styleUrl: './client-identification-number.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [QuoteFormValidarors]
})
export class ClientIdentificationNumberComponent extends QuoteComponent<QuoteModel> {
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngQuoteInit = this.createForm.bind(this);

  public override canDeactivate = (): boolean => {
    this._contextData.personalData = {
      ...this._contextData.personalData,
      identificationNumber: this.form.get('identificationNumber')?.value?.trim()
    };

    return this.form.valid;
  };

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.personalData = {
        ...this._contextData.personalData,
        ...this.form.value
      };
    }
  };

  private createForm() {
    this.form = this.fb.group({
      identificationNumber: new FormControl(this._contextData.personalData.identificationNumber, [
        this.quoteFormValidarors.required(),
        this.isValidDocument()
      ])
    });

    const identificationNumberSubscription = this.form.get('identificationNumber')?.valueChanges.subscribe(value => {
      this.form.get('identificationNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    if (identificationNumberSubscription) {
      this.subscription$.push(identificationNumberSubscription);
    }
  }

  public isValidDocument =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const nifValidator = this.quoteFormValidarors.activateEntryPoint(control, '@isNif', !isNIF(control.value));

      if (nifValidator) {
        return nifValidator;
      }

      const nieValidator = this.quoteFormValidarors.activateEntryPoint(control, '@isNie', !isNIF(control.value));

      return nieValidator;
    };
}
