import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
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

  private readonly platePatterns = [
    '^[0-9]{4}[ -]?[A-Z]{3}$', // 0000SSS
    '^[A-Z]{1,2}[ -]?[0-9]{4}[ -]?[A-Z]{2}$', // S 0000 SS
    '^[A-Z]{2}[ -]?[0-9]{5}$' // SS-00000
  ];

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
    this._contextData.driven.hasDrivenLicense = true;
  }

  public override canDeactivate = (): boolean => this._contextData.driven.hasDrivenLicense === false || this.form.valid;

  public continueWithOutLicensePlate = (): void => {
    this._contextData.vehicle.plateNumber = '';
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
        this.quoteFormValidarors.matches(this.platePatterns)
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
