import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateModule } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
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
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-fuel.component.html',
  styleUrl: './vehicle-fuel.component.scss'
})
export class VehicleFuelComponent implements OnInit, IsValidData {
  public contextData!: QuoteModel;
  public cubicCapacities: CubicCapacityModel[] = [];
  public cubicCapacityNotKnown: CubicCapacityModel = { index: -1, data: 'nsnc' };
  public form!: FormGroup;
  public fuels: FuelModel[] = [];
  public powerNotKnown: PowerRangesModel = { index: '-1', data: 'nsnc' };
  public powers: PowerRangesModel[] = [];
  public selectedCubicCapacity?: CubicCapacityModel;
  public selectedFuel?: FuelModel;
  public selectedPower?: PowerRangesModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedFuel = this.contextData.vehicle.fuel;
    this.selectedCubicCapacity = this.contextData.vehicle.cubicCapacity;
    this.selectedPower = this.contextData.vehicle.powerRange;
  }

  ngOnInit(): void {
    this.vehicleService.modelFuels(this.contextData.vehicle).then(fuel => {
      this.fuels = fuel;
    });

    this.vehicleService.vehiclePowers(this.contextData.vehicle).then(powers => {
      this.powers = powers;
    });

    this.vehicleService.cubicCapacities(this.contextData.vehicle).then(cubicCapacities => {
      this.cubicCapacities = cubicCapacities;
    });
  }

  public canDeactivate = (): boolean => true;

  public selectFuel(fuel: FuelModel) {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      fuel: fuel
    };
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    this.selectedFuel = fuel;
    this.navigateToNextPage();
  }

  public selectCubicCapacity(cubicCapacity: CubicCapacityModel) {
    this.selectedCubicCapacity = cubicCapacity;
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      cubicCapacity: cubicCapacity
    };
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    this.navigateToNextPage();
  }

  public selectPower(power: PowerRangesModel) {
    this.selectedPower = power;
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      powerRange: power
    };
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    this.navigateToNextPage();
  }

  private navigateToNextPage() {
    if (this.contextData.vehicle.fuel && this.contextData.vehicle.cubicCapacity && this.contextData.vehicle.powerRange) {
      this.routingService.nextStep();
    }
  }
}
