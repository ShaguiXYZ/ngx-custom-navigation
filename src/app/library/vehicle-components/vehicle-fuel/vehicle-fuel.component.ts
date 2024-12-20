import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { CubicCapacityModel, FuelModel, VehicleClassesModel } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from '../../_quote-component';

@Component({
  selector: 'quote-vehicle-fuel',
  templateUrl: './vehicle-fuel.component.html',
  styleUrl: './vehicle-fuel.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    SelectableOptionComponent,
    NxAccordionModule,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ],
  providers: [VehicleService],
  standalone: true
})
export class VehicleFuelComponent extends QuoteComponent implements OnInit {
  public cubicCapacityNotKnown: CubicCapacityModel = { index: '-1', data: 'nsnc' };
  public powerNotKnown: VehicleClassesModel = { index: '-1', data: 'nsnc' };

  public cubicCapacities: CubicCapacityModel[] = [];
  public fuels: FuelModel[] = [];
  public powers: VehicleClassesModel[] = [];

  public selectedCubicCapacity?: CubicCapacityModel;
  public selectedFuel?: FuelModel;
  public selectedPower?: VehicleClassesModel;
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  async ngOnInit(): Promise<void> {
    this.selectedFuel = this._contextData.vehicle.fuel;
    this.selectedCubicCapacity = this._contextData.vehicle.cubicCapacity;
    this.selectedPower = this._contextData.vehicle.powerRange;

    [this.fuels, this.cubicCapacities, this.powers] = await Promise.all([
      this.vehicleService.getFuelTypes(this._contextData.vehicle),
      this.vehicleService.cubicCapacities(this._contextData.vehicle),
      this.vehicleService.getVehicleClasses(this._contextData.vehicle)
    ]);
  }

  public override canDeactivate = (): boolean =>
    this._contextData.vehicle.fuel !== undefined &&
    this._contextData.vehicle.powerRange !== undefined &&
    this._contextData.vehicle.cubicCapacity !== undefined;

  public async selectFuel(fuel: FuelModel) {
    this.selectedFuel = fuel;
    this.selectedCubicCapacity = undefined;
    this.selectedPower = undefined;

    this.populateData();

    [this.cubicCapacities, this.powers] = await Promise.all([
      this.vehicleService.cubicCapacities(this._contextData.vehicle),
      this.vehicleService.getVehicleClasses(this._contextData.vehicle)
    ]);
  }

  public async selectCubicCapacity(cubicCapacity: CubicCapacityModel) {
    this.selectedCubicCapacity = cubicCapacity;
    this.selectedPower = undefined;

    this.populateData();

    this.powers = await this.vehicleService.getVehicleClasses(this._contextData.vehicle);
  }

  public selectPower(power: VehicleClassesModel) {
    this.selectedPower = power;

    this.populateData();

    this.routingService.next();
  }

  private populateData() {
    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      fuel: this.selectedFuel,
      cubicCapacity: this.selectedCubicCapacity,
      powerRange: this.selectedPower
    };
  }
}
