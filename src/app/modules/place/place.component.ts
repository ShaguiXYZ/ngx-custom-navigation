import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { LocationService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteMaskDirective } from 'src/app/shared/directives';
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
    QuoteMaskDirective
  ]
})
export class PlaceComponent implements OnInit, OnDestroy, IsValidData {
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;
  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly locationService = inject(LocationService);

  constructor(private readonly fb: FormBuilder) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.footerConfig = {
      showNext: true,
      nextFn: () => this.updateValidData()
    };
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public canDeactivate = (): boolean => this.form.valid;

  private updateValidData = (): boolean => {
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

    this.subscription$.push(
      this.form.controls['postalCode'].statusChanges.subscribe(status => {
        if (status === 'INVALID') {
          this.contextData.place.province = undefined;
        }

        this.footerConfig = {
          ...this.footerConfig,
          disableNext: status !== 'VALID'
        };
      })
    );
  }

  private postalCodeExistsValidator(locationService: LocationService): AsyncValidatorFn {
    return async (control: AbstractControl) => {
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
