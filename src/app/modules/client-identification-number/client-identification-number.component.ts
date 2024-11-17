import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/models';
import { TrackInfo } from 'src/app/core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-client-identification-number',
  templateUrl: './client-identification-number.component.html',
  styleUrl: './client-identification-number.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }],
  standalone: true
})
export class ClientIdentificationNumberComponent extends QuoteComponent implements OnInit, OnDestroy {
  public form!: FormGroup;

  private readonly subscription$: Subscription[] = [];
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public get trackInfo(): Partial<TrackInfo> {
    return {
      ...this._trackInfo,
      label: this.quoteLiteral.transform('footer-next'),
      title: this.quoteLiteral.transform('header'),
      identificationNumber: this.form.controls['identificationNumber'].value
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
    this.form = this.fb.group({
      identificationNumber: new FormControl(this._contextData.personalData.identificationNumber, [Validators.required])
    });

    const identificationNumberSubscription = this.form.get('identificationNumber')?.valueChanges.subscribe(value => {
      this.form.get('identificationNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    if (identificationNumberSubscription) {
      this.subscription$.push(identificationNumberSubscription);
    }
  }
}
