import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { QuoteFormValidarors } from 'src/app/core/form';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

import { QuoteComponent } from 'src/app/core/components';
import { QuoteModel } from 'src/app/library/models';
import { CountryCodes, PatternsByCountry } from './models';

@Component({
  selector: 'quote-license-plate',
  templateUrl: './license-plate.component.html',
  styleUrl: './license-plate.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxLicencePlateModule,
    NxButtonModule,
    QuoteFooterComponent,
    QuoteZoneComponent,
    ReactiveFormsModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    QuoteTrackDirective
  ],
  providers: [QuoteFormValidarors]
})
export class LicensePlateComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public form!: FormGroup;
  public countryCode: CountryCodes = 'E';
  public masks!: string;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = this.createForm.bind(this);

  ngOnInit(): void {
    this.masks = PatternsByCountry[this.countryCode]?.mask ?? '';
    this._contextData.driven.hasDrivenLicense = true;
  }

  public override canDeactivate = (): boolean => this._contextData.driven.hasDrivenLicense === false || this.form.valid;

  public continueWithOutLicensePlate = (): void => {
    this._contextData.vehicle.plateNumber = undefined;
    this._contextData.driven.hasDrivenLicense = false;

    this.routingService.next();
  };

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.vehicle.plateNumber = this.form.value.plateNumber;
    }
  };

  private createForm(): void {
    this.form = this.fb.group({
      plateNumber: new FormControl(this._contextData.vehicle.plateNumber, [
        this.quoteFormValidarors.required(),
        this.quoteFormValidarors.matches(PatternsByCountry[this.countryCode]?.patterns)
      ])
    });

    const plateNumberSubscription = this.form.get('plateNumber')?.valueChanges.subscribe(value => {
      this.form.get('plateNumber')?.setValue(value.trim().toUpperCase(), { emitEvent: false });
    });

    if (plateNumberSubscription) {
      this.subscription$.push(plateNumberSubscription);
    }
  }
}
