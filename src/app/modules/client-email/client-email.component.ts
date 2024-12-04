import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-client-email',
  templateUrl: './client-email.component.html',
  styleUrl: './client-email.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxLinkModule,
    NxSwitcherModule,
    QuoteFooterComponent,
    QuoteZoneComponent,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    ReactiveFormsModule
  ],
  providers: [QuoteFormValidarors]
})
export class ClientEMailComponent extends QuoteComponent implements OnInit {
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
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;

    this.form = this.fb.group({
      email: new FormControl(this._contextData.personalData.email, [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.matches([emailRegex], 'i') // @howto use regex to validate email ignoring case
      ]),
      accepInfo: new FormControl(this._contextData.client.accepInfo, [this.quoteFormValidarors.informed()]),
      acceptPrivacyPolicy: new FormControl(this._contextData.client.acceptPrivacyPolicy, [this.quoteFormValidarors.requiredTrue()])
    });
  }
}
