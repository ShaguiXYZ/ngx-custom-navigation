import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
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
    QuoteLiteralPipe
  ]
})
export class LicensePlateComponent extends QuoteComponent implements OnInit, OnDestroy {
  public form!: FormGroup;

  private readonly subscription$: Subscription[] = [];
  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  constructor() {
    super();

    this._contextData = { ...this._contextData, driven: { ...this._contextData.driven, hasDrivenLicense: true } };
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
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
      plateNumber: new FormControl(this._contextData.vehicle.plateNumber, [Validators.required])
    });

    const plateNumberSubscription = this.form.get('plateNumber')?.valueChanges.subscribe(value => {
      this.form.get('plateNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    if (plateNumberSubscription) {
      this.subscription$.push(plateNumberSubscription);
    }
  }
}
