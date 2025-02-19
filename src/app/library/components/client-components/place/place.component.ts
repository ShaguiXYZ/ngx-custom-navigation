import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteFormValidarors } from 'src/app/core/form';
import { LocationService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective, QuoteMaskDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-place',
  templateUrl: './place.component.html',
  styleUrl: './place.component.scss',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteMaskDirective,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [LocationService, QuoteFormValidarors]
})
export class PlaceComponent extends QuoteComponent<QuoteModel> {
  public location?: string;
  public form!: FormGroup;

  private readonly locationService = inject(LocationService);
  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = this.createForm.bind(this);

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.place = {
        ...this._contextData.place,
        ...this.form.value
      };
    }
  };

  private createForm(): void {
    this.form = this.fb.group({
      postalCode: new FormControl(
        this._contextData.place.postalCode,
        [this.quoteFormValidarors.required()],
        [this.postalCodeExistsValidator()]
      )
    });
  }

  private postalCodeExistsValidator = (): AsyncValidatorFn => {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const location = control.value?.length === 5 ? await this.locationService.getAddress(control.value) : undefined;

      this._contextData.place = { ...location };
      this.location = location?.postalCode ? `${location?.location}, ${location?.province}` : '';

      return this.quoteFormValidarors.activateEntryPoint.bind(this)(control, 'notFound', !location?.postalCode);
    };
  };
}
