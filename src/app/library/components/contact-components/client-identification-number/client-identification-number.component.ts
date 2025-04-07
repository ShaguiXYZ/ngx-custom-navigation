import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { isNIE, isNIF } from './models';

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

  protected override ngOnQuoteInit = this.createForm.bind(this);

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
      identificationNumber: [
        this._contextData.personalData.identificationNumber,
        [this.quoteFormValidarors.required(), this.isValidDocument()]
      ]
    });

    const identificationNumberSubscription = this.form.get('identificationNumber')?.valueChanges.subscribe(value => {
      this.form.get('identificationNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    if (identificationNumberSubscription) {
      this.subscription$.push(identificationNumberSubscription);
    }
  }

  public isValidDocument(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();

      if (!value) {
        return null;
      }

      const nifRegex = /^[0-9]{8}[A-Za-z]$/;
      const nieRegex = /^[XYZ][0-9]{7}[A-Za-z]$/;

      if (nifRegex.test(value)) {
        return this.quoteFormValidarors.activateEntryPoint(control, '@isNif', !isNIF(value));
      }

      if (nieRegex.test(value)) {
        return this.quoteFormValidarors.activateEntryPoint(control, '@isNie', !isNIE(value));
      }

      return { matches: true };
    };
  }
}
