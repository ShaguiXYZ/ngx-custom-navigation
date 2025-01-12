import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { CubicCapacityModel, FuelModel, QuoteModel, VehicleClassesModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-vehicle-fuel',
  templateUrl: './vehicle-fuel.component.html',
  styleUrl: './vehicle-fuel.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    SelectableOptionComponent,
    NxAccordionModule,
    NxCopytextModule,
    NxFormfieldModule,
    QuoteLiteralPipe,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ],
  providers: [VehicleService],
  standalone: true
})
export class VehicleFuelComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public cubicCapacityNotKnown: CubicCapacityModel = { index: '-1', data: 'nsnc' };
  public powerNotKnown: VehicleClassesModel = { index: '-1', data: 'nsnc' };
  public formValidations = {
    cubicCapacity: false,
    fuel: false,
    power: false
  };

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

  public override canDeactivate = (): boolean => {
    this.formValidations = {
      cubicCapacity: !this.selectedCubicCapacity,
      fuel: !this.selectedFuel,
      power: !this.selectedPower
    };

    return !Object.values(this.formValidations).some(validation => validation);
  };

  public async selectFuel(fuel: FuelModel) {
    this.formValidations.fuel = false;
    this.selectedFuel = fuel;
    this.selectedCubicCapacity = undefined;
    this.selectedPower = undefined;

    [this.cubicCapacities, this.powers] = await Promise.all([
      this.vehicleService.cubicCapacities(this._contextData.vehicle),
      this.vehicleService.getVehicleClasses(this._contextData.vehicle)
    ]);
  }

  public async selectCubicCapacity(cubicCapacity: CubicCapacityModel) {
    this.formValidations.cubicCapacity = false;
    this.selectedCubicCapacity = cubicCapacity;
    this.selectedPower = undefined;

    this.powers = await this.vehicleService.getVehicleClasses(this._contextData.vehicle);
  }

  public selectPower(power: VehicleClassesModel) {
    this.formValidations.power = false;
    this.selectedPower = power;
  }

  public populateData() {
    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      fuel: this.selectedFuel,
      cubicCapacity: this.selectedCubicCapacity,
      powerRange: this.selectedPower
    };

    this.routingService.next();
  }
}
