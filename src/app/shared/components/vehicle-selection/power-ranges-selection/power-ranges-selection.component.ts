import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { VehicleService } from 'src/app/core/services';
import { IVehicleModel, PowerRangesModel, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'quote-power-selection',
  standalone: true,
  imports: [NxButtonModule],
  templateUrl: './power-ranges-selection.component.html',
  styleUrl: './power-ranges-selection.component.scss'
})
export class PowerRangesSelectionComponent implements OnInit, OnDestroy {
  @Output()
  public uiSelect: EventEmitter<PowerRangesModel> = new EventEmitter<PowerRangesModel>();

  public powers: PowerRangesModel[] = [];
  public selectedPower?: PowerRangesModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly vehicleService = inject(VehicleService);

  private subscription$: Subscription[] = [];

  ngOnInit(): void {
    const data = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.selectedPower = data.vehicle?.fuel;
    data.vehicle && this.powersFromModel(data.vehicle);

    this.subscription$.push(
      this.contextDataService.onDataChange<QuoteModel>(QUOTE_CONTEXT_DATA).subscribe(data => {
        this.selectedPower = data.vehicle?.powerRange;
        this.powersFromModel(data.vehicle);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public selectPower(power: PowerRangesModel): void {
    this.selectedPower = power;
    this.uiSelect.emit(power);
  }

  public buttonType = (power: PowerRangesModel): string =>
    power.index === this.selectedPower?.index ? 'primary medium' : 'tertiary medium';

  private powersFromModel = (vehicle: IVehicleModel) =>
    vehicle.model && this.vehicleService.vehiclePowers(vehicle).then(powers => (this.powers = powers));
}
