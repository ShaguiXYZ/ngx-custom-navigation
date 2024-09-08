import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxDropdownModule, NxDropdownSelectChange } from '@aposin/ng-aquila/dropdown';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateModule } from '@ngx-translate/core';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { VehicleService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { BrandKey, MAX_BUTTON_MODELS } from '../models';

@Component({
  selector: 'quote-model-selection',
  standalone: true,
  imports: [NxButtonModule, NxDropdownModule, NxIconModule, NxInputModule, TranslateModule],
  templateUrl: './model-selection.component.html',
  styleUrl: './model-selection.component.scss'
})
export class ModelSelectionComponent implements OnInit, OnDestroy {
  @Output()
  public uiSelect: EventEmitter<string> = new EventEmitter<string>();

  public models: string[] = [];
  public modelButtons: string[] = [];
  public selectedModel?: string;
  public showAll?: boolean;

  private readonly contextDataService = inject(ContextDataService);
  private readonly vehicleService = inject(VehicleService);

  private subscription$: Subscription[] = [];

  ngOnInit(): void {
    const data = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);

    this.selectedModel = data.vehicle?.model;
    data.vehicle?.make &&
      this.modelsFromBrand(data.vehicle.make).then(
        () => (this.showAll = hasValue(this.selectedModel) && this.modelButtons.findIndex(model => model === this.selectedModel) < 0)
      );

    this.subscription$.push(
      this.contextDataService.onDataChange<QuoteModel>(QUOTE_CONTEXT_DATA_NAME).subscribe(data => {
        this.selectedModel = data.vehicle?.model;
        data.vehicle?.make && this.modelsFromBrand(data.vehicle.make);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public selectModel(model: string): void {
    this.selectedModel = model;
    this.uiSelect.emit(model);
  }

  public onModelChange(event: NxDropdownSelectChange): void {
    this.selectModel(this.models.find(model => model === event.value)!);
  }

  public buttonType = (model: string): string => (model === this.selectedModel ? 'primary medium' : 'tertiary medium');

  public toggleAllModels(): void {
    this.showAll = !this.showAll;
  }

  private modelsFromBrand = (brand: BrandKey): Promise<unknown> =>
    this.vehicleService.vehicleModels(brand).then(models => {
      this.models = models;
      this.modelButtons = models.slice(0, MAX_BUTTON_MODELS);
    });
}
