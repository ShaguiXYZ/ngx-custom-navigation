import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel, QuoteVehicleModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

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
    QuoteLiteralPipe,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ],
  providers: [VehicleService]
})
export class YourCarIsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public vehicleOptions: QuoteVehicleModel[] = [];
  public selectedVehicle?: QuoteVehicleModel;
  public notFound = false;

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  async ngOnInit(): Promise<void> {
    this.selectedVehicle = !this._contextData.vehicle.notFound ? this._contextData.vehicle : {};

    if (this._contextData.vehicle.plateNumber) {
      this.vehicleOptions = await this.vehicleService.findByPlate(this._contextData.vehicle.plateNumber);
    } else {
      this.vehicleOptions = await this.vehicleService.vehicles();
    }

    this.notFound = this.vehicleOptions.length === 0;
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public selectVehicle(vehicle: QuoteVehicleModel) {
    this._contextData.vehicle = { ...this._contextData.vehicle, ...vehicle, notFound: false };

    this.routingService.next();
  }

  public continue() {
    this._contextData.vehicle.notFound = true;
    this.routingService.next();
  }

  private isValidData = (): boolean => this._contextData.vehicle.notFound || !!this._contextData.vehicle?.brand;
}
