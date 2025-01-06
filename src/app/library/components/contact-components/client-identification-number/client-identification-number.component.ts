import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

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
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }, QuoteFormValidarors],
  standalone: true
})
export class ClientIdentificationNumberComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.form.valid;

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
      identificationNumber: new FormControl(this._contextData.personalData.identificationNumber, [this.quoteFormValidarors.required()])
    });

    const identificationNumberSubscription = this.form.get('identificationNumber')?.valueChanges.subscribe(value => {
      this.form.get('identificationNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    if (identificationNumberSubscription) {
      this.subscription$.push(identificationNumberSubscription);
    }
  }
}
