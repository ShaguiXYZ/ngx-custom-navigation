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
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { LocationService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective, QuoteMaskDirective } from 'src/app/shared/directives';
import { QuoteComponent } from 'src/app/core/models';
import { QuoteModel } from 'src/app/shared/models';

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
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly locationService = inject(LocationService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.footerConfig = {
      showNext: true,
      nextFn: () => this.updateValidData()
    };

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

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }
  };

  public get province(): IndexedData | undefined {
    return this.contextData.place.province;
  }

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
      const address = await locationService.getAddresses(control.value);

      this.contextData.place.province = address;

      return address ? null : { postalCodeNotRecognized: true };
    };
  }
}
