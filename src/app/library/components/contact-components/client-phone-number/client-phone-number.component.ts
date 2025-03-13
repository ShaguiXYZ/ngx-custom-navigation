import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxPhoneInputComponent } from '@aposin/ng-aquila/phone-input';
import countries from 'i18n-iso-countries';
import { CountryCode } from 'libphonenumber-js';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteFormValidarors } from 'src/app/core/form';
import { LanguageConfig } from 'src/app/core/models';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-client-phone-number',
  templateUrl: './client-phone-number.component.html',
  styleUrl: './client-phone-number.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxPhoneInputComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [QuoteFormValidarors]
})
export class ClientPhoneNumberComponent extends QuoteComponent<QuoteModel> {
  public coutryCode: CountryCode = 'ES';
  public countryNames = countries.getNames(LanguageConfig.language(this.languageService.current), { select: 'official' });
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = () => {
    this.createForm();

    this.subscription$.push(
      this.languageService.asObservable().subscribe(locale => {
        this.countryNames = countries.getNames(LanguageConfig.language(locale), { select: 'official' });
      })
    );
  };

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
      phoneNumber: new FormControl(this._contextData.personalData.phoneNumber ?? '', [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.validateMobileNumber()
      ])
    });
  }
}
