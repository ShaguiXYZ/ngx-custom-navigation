import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { QuoteComponent } from '../../../../core/components';
import { DEBOUNCE_TIME } from '../../../../core/constants';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent, TextCardComponent } from '../../../../shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { VehicleService } from '../../../services';

@Component({
  selector: 'quote-vehicle-models',
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteZoneComponent,
    TextCardComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteTrackDirective,
    QuoteAutoFocusDirective,
    QuoteLiteralPipe
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [VehicleService]
})
export class VehicleModelsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public form!: FormGroup;
  public models: string[] = [];
  public selectedModel?: string;
  public notFound = false;

  private readonly $searchInput = viewChild.required<ElementRef>('searchInput');

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.createForm();

    if (!this._contextData.vehicle.brand) {
      console.warn('Not brand selected');
      this.initData();
      return;
    }

    this.selectedModel = this._contextData.vehicle.model;

    await this.filteredModels();

    if (this.selectedModel && !this.models.includes(this.selectedModel)) {
      this.initData();
    }
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectModel(model: string) {
    const selectionChanged = this.selectedModel !== model;

    if (selectionChanged) {
      this.selectedModel = model;

      this._contextData.vehicle = {
        ...this._contextData.vehicle,
        model: this.selectedModel
      };
    }

    this.routingService.next();
  }

  public clearInput(): void {
    this.form.patchValue({ searchInput: '' });
    this.filteredModels();
  }

  private initData = (): void => {
    this._contextData.vehicle.model = undefined;
    this.selectedModel = undefined;
    this.form.patchValue({ searchInput: '' });

    this.filteredModels();
  };

  private updateValidData = (): boolean => {
    return !!this._contextData.vehicle.model;
  };

  private createForm() {
    this.form = this.fb.group({
      searchInput: [this._contextData.vehicle.model]
    });

    this.subscription$.push(this.searchBoxConfig());
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.$searchInput().nativeElement, 'keyup')
      .pipe(
        map(event => event),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe(async () => this.filteredModels());
  }

  private async filteredModels(): Promise<void> {
    const { brand, yearOfManufacture } = this._contextData.vehicle;
    const { searchInput } = this.form.value;

    if (!brand) {
      this.models = [];
      this.notFound = true;
      return;
    }

    const models = await this.vehicleService.getModels(brand, searchInput, yearOfManufacture);

    this.models = models.includes(this.selectedModel ?? '')
      ? [this.selectedModel!, ...models.filter(model => model !== this.selectedModel)]
      : models;

    this.notFound = this.models.length === 0;
  }
}
