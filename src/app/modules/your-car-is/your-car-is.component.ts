import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { QuoteComponent, QuoteVehicleModel } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-your-car-is',
  templateUrl: './your-car-is.component.html',
  styleUrl: './your-car-is.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    TextCardComponent,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteLiteralDirective
  ],
  providers: [VehicleService],
  standalone: true
})
export class YourCarIsComponent extends QuoteComponent implements OnInit {
  public vehicleOptions: QuoteVehicleModel[] = [];
  public selectedVehicle?: QuoteVehicleModel;

  private continueWithSelectedVehicle = true;

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  async ngOnInit(): Promise<void> {
    this.selectedVehicle = this.contextData.vehicle;

    this.vehicleOptions = await this.vehicleService.vehicles();
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public selectVehicle(vehicle: QuoteVehicleModel) {
    this.contextData.vehicle = { ...this.contextData.vehicle, ...vehicle };
    this.populateContextData();

    this.routingService.next();
  }

  public continue() {
    this.continueWithSelectedVehicle = false;
    this.contextData.vehicle = QuoteVehicleModel.init();
    this.populateContextData();

    this.routingService.next();
  }

  private isValidData = (): boolean => !this.continueWithSelectedVehicle || !!this.contextData.vehicle?.make;
}
