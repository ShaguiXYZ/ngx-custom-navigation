import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { TranslateModule } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent } from 'src/app/shared/components';
import {
  BrandsSelectionComponent,
  FuelSelectionComponent,
  ModelSelectionComponent,
  PowerRangesSelectionComponent,
  VehicleYearSelectionComponent
} from 'src/app/shared/components/vehicle-selection';
import { IsValidData } from 'src/app/shared/guards';
import { FuelModel, PowerRangesModel, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    BrandsSelectionComponent,
    FuelSelectionComponent,
    HeaderTitleComponent,
    ModelSelectionComponent,
    PowerRangesSelectionComponent,
    VehicleYearSelectionComponent,
    CommonModule,
    NxAccordionModule,
    NxHeadlineModule,
    TranslateModule
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements IsValidData {
  public contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  public canDeactivate = (
    currentRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    next?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public selectBrand(brand: string) {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      make: brand,
      model: undefined,
      fuel: undefined,
      powerRange: undefined,
      power: undefined,
      yearOfManufacture: undefined
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
  }

  public selectModel(model: string) {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      model,
      fuel: undefined,
      powerRange: undefined,
      power: undefined,
      yearOfManufacture: undefined
    };

    this.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, this.contextData);
  }

  public selectFuel(fuel: FuelModel) {
    this.contextData.vehicle = { ...this.contextData.vehicle, fuel };
    this.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, this.contextData);
  }

  public selectPower(power: PowerRangesModel) {
    this.contextData.vehicle = { ...this.contextData.vehicle, powerRange: power, power: Number(power.index) };
    this.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, this.contextData);
  }

  public selectYear(year: number) {
    this.contextData.vehicle = { ...this.contextData.vehicle, yearOfManufacture: year };
    this.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, this.contextData);
  }

  // eslint-disable-next-line arrow-body-style
  private isValidData = (): boolean => {
    // TODO: implement logic
    return true;
  };
}
