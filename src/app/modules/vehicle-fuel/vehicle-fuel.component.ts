import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
import { CubicCapacityModel, FuelModel, PowerRangesModel, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-vehicle-fuel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderTitleComponent,
    SelectableOptionComponent,
    NxAccordionModule,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective
  ],
  templateUrl: './vehicle-fuel.component.html',
  styleUrl: './vehicle-fuel.component.scss'
})
export class VehicleFuelComponent implements OnInit, IsValidData {
  public cubicCapacityNotKnown: CubicCapacityModel = { index: -1, data: 'nsnc' };
  public powerNotKnown: PowerRangesModel = { index: '-1', data: 'nsnc' };

  public cubicCapacities: CubicCapacityModel[] = [];
  public fuels: FuelModel[] = [];
  public powers: PowerRangesModel[] = [];

  public form!: FormGroup;

  public selectedCubicCapacity?: CubicCapacityModel;
  public selectedFuel?: FuelModel;
  public selectedPower?: PowerRangesModel;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedFuel = this.contextData.vehicle.fuel;
    this.selectedCubicCapacity = this.contextData.vehicle.cubicCapacity;
    this.selectedPower = this.contextData.vehicle.powerRange;
  }

  async ngOnInit(): Promise<void> {
    [this.fuels, this.powers, this.cubicCapacities] = await Promise.all([
      this.vehicleService.modelFuels(this.contextData.vehicle),
      this.vehicleService.vehiclePowers(this.contextData.vehicle),
      this.vehicleService.cubicCapacities(this.contextData.vehicle)
    ]);
  }

  public canDeactivate = (): boolean =>
    this.contextData.vehicle.fuel !== undefined &&
    this.contextData.vehicle.powerRange !== undefined &&
    this.contextData.vehicle.cubicCapacity !== undefined;

  public async selectFuel(fuel: FuelModel) {
    this.selectedFuel = fuel;
    this.selectedCubicCapacity = undefined;
    this.selectedPower = undefined;
  }

  public selectCubicCapacity(cubicCapacity: CubicCapacityModel) {
    this.selectedCubicCapacity = cubicCapacity;
    this.selectedPower = undefined;
  }

  public selectPower(power: PowerRangesModel) {
    this.selectedPower = power;

    this.navigateToNextPage();
  }

  private navigateToNextPage() {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      fuel: this.selectedFuel,
      cubicCapacity: this.selectedCubicCapacity,
      powerRange: this.selectedPower
    };
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }
}
