import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { VehicleService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'quote-vehicle-year-selection',
  standalone: true,
  imports: [NxButtonModule],
  templateUrl: './vehicle-year-selection.component.html',
  styleUrl: './vehicle-year-selection.component.scss'
})
export class VehicleYearSelectionComponent implements OnInit, OnDestroy {
  @Output()
  public uiSelect: EventEmitter<number> = new EventEmitter<number>();

  public years: number[] = [];
  public selectedYear?: number;

  private readonly contextDataService = inject(ContextDataService);
  private readonly vehicleService = inject(VehicleService);

  private subscription$: Subscription[] = [];

  ngOnInit(): void {
    const data = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.selectedYear = data.vehicle?.yearOfManufacture;
    data.vehicle && this.yearsFromModel();

    this.subscription$.push(
      this.contextDataService.onDataChange<QuoteModel>(QUOTE_CONTEXT_DATA).subscribe(data => {
        this.selectedYear = data.vehicle?.yearOfManufacture;
        this.yearsFromModel();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public selectYear(year: number): void {
    this.selectedYear = year;
    this.uiSelect.emit(year);
  }

  public buttonType = (year: number): string => (year === this.selectedYear ? 'primary medium' : 'tertiary medium');

  private yearsFromModel = () => this.vehicleService.getYears().then(years => (this.years = years));
}
