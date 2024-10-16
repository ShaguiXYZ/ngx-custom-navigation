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
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-place',
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
export class PlaceComponent implements OnInit, IsValidData {
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly locationService = inject(LocationService);

  constructor(private readonly fb: FormBuilder) {
    this.footerConfig = {
      showNext: true,
      nextFn: () => this.updateValidData()
    };
  }

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.createForm();
  }

  public canDeactivate = (): boolean => this.form.valid;

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.place = {
        ...this.contextData.place,
        ...this.form.value
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return !!this.contextData.place.province;
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

      if (address) {
        this.contextData.place.province = address;
        return null;
      } else {
        return { postalCodeNotRecognized: true };
      }
    };
  }
}
