import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { VehicleService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { FuelModel, IVehicleModel } from '../models';

@Component({
  selector: 'quote-fuel-selection',
  standalone: true,
  imports: [NxButtonModule],
  templateUrl: './fuel-selection.component.html',
  styleUrl: './fuel-selection.component.scss'
})
export class FuelSelectionComponent implements OnInit, OnDestroy {
  @Output()
  public uiSelect: EventEmitter<FuelModel> = new EventEmitter<FuelModel>();

  public fuels: FuelModel[] = [];
  public selectedFuel?: FuelModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly vehicleService = inject(VehicleService);

  private subscription$: Subscription[] = [];

  ngOnInit(): void {
    const data = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);

    this.selectedFuel = data.vehicle?.fuel;
    data.vehicle && this.fuelsFromModel(data.vehicle);

    this.subscription$.push(
      this.contextDataService.onDataChange<QuoteModel>(QUOTE_CONTEXT_DATA_NAME).subscribe(data => {
        this.selectedFuel = data.vehicle?.fuel;
        this.fuelsFromModel(data.vehicle);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public selectFuel(fuel: FuelModel): void {
    this.selectedFuel = fuel;
    this.uiSelect.emit(fuel);
  }

  public buttonType = (fuel: FuelModel): string => (fuel.index === this.selectedFuel?.index ? 'primary medium' : 'tertiary medium');

  private fuelsFromModel = (vehicle: IVehicleModel) =>
    vehicle.model && this.vehicleService.modelFuels(vehicle).then(fuels => (this.fuels = fuels));
}
