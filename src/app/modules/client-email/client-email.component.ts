import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-client-email',
  templateUrl: './client-email.component.html',
  styleUrl: './client-email.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxLinkModule,
    NxSwitcherModule,
    QuoteFooterComponent,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    ReactiveFormsModule
  ]
})
export class ClientEMailComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.personalData = {
        ...this.contextData.personalData,
        email: this.form.value['email']
      };
      this.contextData.client = {
        ...this.contextData.client,
        accepInfo: this.form.value['accepInfo'],
        acceptPrivacyPolicy: this.form.value['acceptPrivacyPolicy']
      };

      this.populateContextData();
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      email: new FormControl(this.contextData.personalData.email, [Validators.required, Validators.email]),
      accepInfo: new FormControl(this.contextData.client.accepInfo, [Validators.required]),
      acceptPrivacyPolicy: new FormControl(this.contextData.client.acceptPrivacyPolicy, [Validators.requiredTrue])
    });
  }
}
