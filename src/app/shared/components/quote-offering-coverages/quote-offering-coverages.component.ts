import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxTabChangeEvent, NxTabsModule } from '@aposin/ng-aquila/tabs';
import { Coverage, OfferingPriceModel } from 'src/app/shared/models';
import { HeaderTitleComponent } from '../header-title';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';

@Component({
  selector: 'quote-offering-coverages',
  templateUrl: './quote-offering-coverages.component.html',
  styleUrl: './quote-offering-coverages.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, NxHeadlineModule, NxIconModule, NxTabsModule]
})
export class QuoteOfferingCoveragesComponent {
  private _selectedPriceIndex = 0;
  private _selectedFeeIndex = 0;
  private _prices: OfferingPriceModel[] = [];

  @Input()
  public set selectedPriceIndex(value: number) {
    this._selectedPriceIndex = value;
    this.updateCoverageList();
  }

  public get selectedPriceIndex(): number {
    return this._selectedPriceIndex;
  }

  @Input()
  public set selectedFeeIndex(value: number) {
    this._selectedFeeIndex = value;
    this.updateCoverageList();
  }

  public get selectedFeeIndex(): number {
    return this._selectedFeeIndex;
  }

  @Input()
  public set prices(value: OfferingPriceModel[]) {
    this._prices = value;
  }

  public get prices(): OfferingPriceModel[] {
    return this._prices;
  }

  public coverageList: Coverage[] = [];

  public selectedPriceIndexChange($event: NxTabChangeEvent) {
    this.selectedPriceIndex = $event.index;
    this.updateCoverageList();
  }

  private updateCoverageList() {
    // this.coverageList = (this._prices[this.selectedPriceIndex].coverageList as Coverage[][])[
    //   this._prices[this.selectedPriceIndex].fee.length ? this.selectedFeeIndex : 0
    // ];
  }
}
