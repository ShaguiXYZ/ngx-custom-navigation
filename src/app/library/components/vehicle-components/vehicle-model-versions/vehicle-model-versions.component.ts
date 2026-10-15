import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { QuoteComponent } from '../../../../core/components';
import { DEBOUNCE_TIME } from '../../../../core/constants';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent, TextCardComponent } from '../../../../shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { ModelVersionModel } from '../../../models/vehicle';
import { VehicleService } from '../../../services';

@Component({
  selector: 'quote-vehicle-model-versions',
  templateUrl: './vehicle-model-versions.component.html',
  styleUrl: './vehicle-model-versions.component.scss',
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
export class VehicleModelVersionsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public form!: FormGroup;
  public modelVersions: ModelVersionModel[] = [];
  public selectedModelVersion?: ModelVersionModel;
  public notFound = false;

  private readonly $searchInput = viewChild.required<ElementRef>('searchInput');

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.createForm();
    this.selectedModelVersion = this._contextData.vehicle.modelVersion;

    await this.filteredVersions();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectVersion(version: ModelVersionModel) {
    this.selectedModelVersion = version;

    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      modelVersion: this.selectedModelVersion
    };

    this.routingService.next();
  }

  public clearInput(): void {
    this.form.patchValue({ searchInput: '' });
    this.filteredVersions();
  }

  private updateValidData = (): boolean => {
    return !!this._contextData.vehicle.modelVersion;
  };

  private createForm() {
    this.form = this.fb.group({
      searchInput: [this._contextData.vehicle.modelVersion?.data]
    });

    this.subscription$.push(this.searchBoxConfig());
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.$searchInput().nativeElement, 'keyup')
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(() => this.filteredVersions());
  }

  private async filteredVersions(): Promise<void> {
    const { brand, model, yearOfManufacture } = this._contextData.vehicle;
    const { searchInput } = this.form.value;

    const modelVersions = await this.vehicleService.getSubmodels(brand!, model!, searchInput, yearOfManufacture);

    const selectedIndex = this.selectedModelVersion?.index;
    this.modelVersions = modelVersions.filter(version => version.index !== selectedIndex);

    if (this.selectedModelVersion && modelVersions.some(version => version.index === selectedIndex)) {
      this.modelVersions.unshift(this.selectedModelVersion);
    }

    this.notFound = this.modelVersions.length === 0;
  }
}
