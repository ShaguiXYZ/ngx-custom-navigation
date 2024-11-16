import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { QuoteComponent } from 'src/app/core/models';
import { TrackInfo } from 'src/app/core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-client-phone-number',
  templateUrl: './client-phone-number.component.html',
  styleUrl: './client-phone-number.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxMaskModule,
    NxInputModule,
    QuoteFooterComponent,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class ClientPhoneNumberComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public get trackInfo(): Partial<TrackInfo> {
    return {
      ...this._trackInfo,
      label: this.quoteLiteral.transform('footer-next'),
      title: this.quoteLiteral.transform('header'),
      phoneNumber: this.form.controls['phoneNumber'].value
    };
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
    this.form = this.fb.group(
      {
        phoneNumber: new FormControl(this._contextData.personalData.phoneNumber, [Validators.required])
      },
      { updateOn: 'blur' }
    );
  }
}
