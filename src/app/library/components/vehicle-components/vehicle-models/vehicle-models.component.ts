import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

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
  providers: [VehicleService]
})
export class VehicleModelsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public models: string[] = [];
  public selectedModel?: string;
  public notFound = false;

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
      searchInput: new FormControl(this._contextData.vehicle.model)
    });

    this.subscription$.push(this.searchBoxConfig());
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe(async () => this.filteredModels());
  }

  private filteredModels = (): Promise<void> =>
    this.vehicleService.getModels(this._contextData.vehicle.brand!, this.form.value.searchInput).then(models => {
      this.models = models;
      this.notFound = this.models.length === 0;
    });
}
