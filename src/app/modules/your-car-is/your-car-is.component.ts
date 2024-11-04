import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteVehicleModel } from 'src/app/shared/models';
import { YourCarIsService } from './services';

@Component({
  selector: 'quote-your-car-is',
  templateUrl: './your-car-is.component.html',
  styleUrl: './your-car-is.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    SelectableOptionComponent,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteLiteralDirective
  ],
  providers: [YourCarIsService]
})
export class YourCarIsComponent extends QuoteComponent implements OnInit {
  public vehicleOptions: QuoteVehicleModel[] = [];
  public selectedVehicle?: QuoteVehicleModel;
  public footerConfig!: QuoteFooterConfig;

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  async ngOnInit(): Promise<void> {
    this.footerConfig = {
      showBack: false,
      showNext: false
    };

    this.selectedVehicle = this.contextData.vehicle;

    this.vehicleOptions = await this.vehicleService.vehicles();
  }

  public override canDeactivate = (): boolean => !!this.selectedVehicle;

  public selectVehicle(vehicle: QuoteVehicleModel) {
    this.contextData.vehicle = { ...this.contextData.vehicle, ...vehicle };
    this.populateContextData();

    this.routingService.nextStep();
  }

  public continue() {
    this.selectVehicle(QuoteVehicleModel.init());
  }
}
