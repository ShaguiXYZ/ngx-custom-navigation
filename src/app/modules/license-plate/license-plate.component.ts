import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-license-plate',
  templateUrl: './license-plate.component.html',
  styleUrl: './license-plate.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.createForm();
    this.footerConfig = { showNext: true, nextFn: this.saveContextData };
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public continueWithOutLicensePlate() {
    this.contextData.driven.hasDrivenLicense = false;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => {
    if (this.contextData.driven.hasDrivenLicense === false) {
      this.contextData.vehicle.plateNumber = '';
      return true;
    }

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.vehicle.plateNumber = this.form.value.plateNumber;
      this.contextData.driven.hasDrivenLicense = true;

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

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

  private saveContextData = (): void => {
    this.contextData.driven.hasDrivenLicense = true;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
  };
}
