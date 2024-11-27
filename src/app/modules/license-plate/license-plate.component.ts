import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-license-plate',
  templateUrl: './license-plate.component.html',
  styleUrl: './license-plate.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxLicencePlateModule,
    NxMaskModule,
    NxButtonModule,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    QuoteTrackDirective
  ],
  providers: [QuoteFormValidarors]
})
export class LicensePlateComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  constructor() {
    super();

    this._contextData = { ...this._contextData, driven: { ...this._contextData.driven, hasDrivenLicense: true } };
  }

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public continueWithOutLicensePlate() {
    this._contextData.driven.hasDrivenLicense = false;
    this._contextData.vehicle.plateNumber = '';
    this.routingService.next(this._contextData);
  }

  private updateValidData = (): boolean => {
    if (this._contextData.driven.hasDrivenLicense === false) {
      return true;
    }

    this._contextData.driven.hasDrivenLicense = true;

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.vehicle.plateNumber = this.form.value.plateNumber;
    }

    return this.form.valid;
  };

  private createForm(): void {
    this.form = this.fb.group({
      plateNumber: new FormControl(this._contextData.vehicle.plateNumber, [this.quoteFormValidarors.required()])
    });

    const plateNumberSubscription = this.form.get('plateNumber')?.valueChanges.subscribe(value => {
      this.form.get('plateNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    if (plateNumberSubscription) {
      this.subscription$.push(plateNumberSubscription);
    }
  }
}
