import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { LocationModel, QuoteComponent } from 'src/app/core/models';
import { LocationService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective, QuoteMaskDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-place',
  templateUrl: './place.component.html',
  styleUrl: './place.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteMaskDirective,
    QuoteLiteralDirective
  ]
})
export class PlaceComponent extends QuoteComponent implements OnInit {
  public location?: string;
  public form!: FormGroup;
  public footerConfig: QuoteFooterConfig = { showNext: true };

  private readonly locationService = inject(LocationService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.footerConfig = { ...this.footerConfig, nextFn: this.updateValidData };

    this.createForm();
  }

  public override canDeactivate = (): boolean => this.form.valid;

  private updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.place = {
        ...this.contextData.place,
        ...this.form.value
      };

      this.populateContextData();
    }
  };

  private createForm(): void {
    this.form = this.fb.group({
      postalCode: new FormControl(
        this.contextData.place.postalCode,
        [Validators.required],
        [this.postalCodeExistsValidator(this.locationService)]
      )
    });
  }

  private postalCodeExistsValidator(locationService: LocationService): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const location = await locationService.getAddresses(control.value);

      this.updateContextData(location);

      return location?.postalCode ? null : { postalCodeNotRecognized: true };
    };
  }

  private updateContextData(location?: LocationModel) {
    this.contextData.place = { ...location };
    this.location = this.locationFormfieldHint(location);
  }

  private locationFormfieldHint = (location?: LocationModel) =>
    location?.postalCode ? `${location?.location}, ${location?.province}` : '';
}
