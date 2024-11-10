import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
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
export class LicensePlateComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  constructor() {
    super();

    this.contextData = { ...this.contextData, driven: { ...this.contextData.driven, hasDrivenLicense: true } };
  }

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public continueWithOutLicensePlate() {
    this.contextData.driven.hasDrivenLicense = false;
    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => {
    if (this.contextData.driven.hasDrivenLicense === false) {
      this.contextData.vehicle.plateNumber = '';
      this.populateContextData();

      return true;
    }

    this.contextData.driven.hasDrivenLicense = true;

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.vehicle.plateNumber = this.form.value.plateNumber;
    }

    this.populateContextData();

    return this.form.valid;
  };

  private createForm(): void {
    this.form = this.fb.group(
      {
        plateNumber: new FormControl(this.contextData.vehicle.plateNumber, [Validators.required])
      },
      { updateOn: 'blur' }
    );
  }
}
