import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { NxLinkModule } from '@allianz/ng-aquila/link';
import { NxSwitcherModule } from '@allianz/ng-aquila/switcher';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuoteComponent } from '../../../../core/components';
import { QuoteFormValidarors } from '../../../../core/form';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from '../../../../shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-client-email',
  templateUrl: './client-email.component.html',
  styleUrl: './client-email.component.scss',
  imports: [
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxLinkModule,
    NxSwitcherModule,
    QuoteFooterComponent,
    QuoteZoneComponent,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [QuoteFormValidarors]
})
export class ClientEMailComponent extends QuoteComponent<QuoteModel> {
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = this.createForm.bind(this);

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.personalData = {
        ...this._contextData.personalData,
        email: this.form.value['email']
      };
      this._contextData.client = {
        ...this._contextData.client,
        accepInfo: this.form.value['accepInfo'],
        acceptPrivacyPolicy: this.form.value['acceptPrivacyPolicy']
      };
    }
  };

  private createForm() {
    const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    this.form = this.fb.group({
      email: [
        this._contextData.personalData.email,
        [
          this.quoteFormValidarors.required(),
          this.quoteFormValidarors.matches([emailRegex]) // @howto use regex to validate email ignoring case
        ]
      ],
      accepInfo: [this._contextData.client.accepInfo ?? false, [this.quoteFormValidarors.informed()]],
      acceptPrivacyPolicy: [this._contextData.client.acceptPrivacyPolicy ?? false, [this.quoteFormValidarors.requiredTrue()]]
    });
  }
}
