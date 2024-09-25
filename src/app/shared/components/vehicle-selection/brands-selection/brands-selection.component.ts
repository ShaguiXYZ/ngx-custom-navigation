import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxDropdownModule, NxDropdownSelectChange } from '@aposin/ng-aquila/dropdown';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateModule } from '@ngx-translate/core';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { BrandData, brandDictionary, QuoteModel } from 'src/app/shared/models';
import { ModelSelectionComponent } from '../model-selection';
import { BrandComponent } from './components';

@Component({
  selector: 'quote-brands-selection',
  standalone: true,
  imports: [
    CommonModule,
    BrandComponent,
    ModelSelectionComponent,
    NxButtonModule,
    NxDropdownModule,
    NxIconModule,
    NxInputModule,
    TranslateModule
  ],
  templateUrl: './brands-selection.component.html',
  styleUrl: './brands-selection.component.scss'
})
export class BrandsSelectionComponent implements OnInit {
  @Output()
  public uiSelect: EventEmitter<string> = new EventEmitter<string>();

  public selectedBrand?: string;
  public iconBrands = BrandData.iconBrands();
  public allBrands = BrandData.allBrands();
  public showAll?: boolean;

  public readonly brands = brandDictionary;

  private readonly contextDataService = inject(ContextDataService);

  ngOnInit(): void {
    const data = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.selectedBrand = data.vehicle?.make;
    this.showAll = hasValue(this.selectedBrand) && this.iconBrands.findIndex(brand => brand === this.selectedBrand) < 0;
  }

  public selectBrand(event: string): void {
    this.selectedBrand = event;

    this.uiSelect.emit(event);
  }

  public onBranchChange(event: NxDropdownSelectChange): void {
    this.selectBrand(event.value);
  }

  public toggleAllBrands(): void {
    this.showAll = !this.showAll;
  }
}
