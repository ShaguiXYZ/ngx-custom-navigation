import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { IIconData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import {
  HeaderTitleComponent,
  IconCardComponent,
  QuoteFooterComponent,
  QuoteZoneComponent,
  TextCardComponent
} from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { BrandComponentService } from './services';

@Component({
  selector: 'quote-vehicle-brand',
  templateUrl: './vehicle-brand.component.html',
  styleUrl: './vehicle-brand.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    IconCardComponent,
    TextCardComponent,
    QuoteZoneComponent,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteAutoFocusDirective,
    QuoteLiteralPipe,
    QuoteTrackDirective
  ],
  providers: [BrandComponentService, VehicleService]
})
export class VehicleBrandComponent extends QuoteComponent<QuoteModel> implements OnInit {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public iconBrands: IIconData[] = [];
  public searchedBrands: string[] = [];
  public selectedBrand?: string;
  public notFound = false;

  private readonly routingService = inject(RoutingService);
  private readonly brandComponentService = inject(BrandComponentService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    const { yearOfManufacture } = this._contextData.vehicle;
    this.createForm();

    const iconDictionary = await this.brandComponentService.iconBrands();
    const brandList = await this.vehicleService.getBrands(undefined, yearOfManufacture);

    this.iconBrands = brandList
      .filter(brand => Object.keys(iconDictionary).includes(brand))
      .map(brand => ({ ...iconDictionary[brand], index: brand, data: brand } as IIconData));

    this.selectedBrand = this._contextData.vehicle.brand;

    this.searchBrands();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectBrand(event: string): void {
    const selectionChanged = this.selectedBrand !== event;

    if (selectionChanged) {
      this.selectedBrand = event;

      this._contextData.vehicle = {
        ...this._contextData.vehicle,
        brand: this.selectedBrand!
      };
    }

    this.routingService.next();
  }

  public clearInput(): void {
    this.form.patchValue({ searchInput: '' });
    this.searchBrands();
  }

  private createForm(): void {
    this.form = this.fb.group({
      searchInput: [this._contextData.vehicle.brand]
    });

    this.subscription$.push(this.searchBoxConfig());
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(() => this.searchBrands());
  }

  private async searchBrands(): Promise<void> {
    if (this.form.value.searchInput || this.iconBrands.length === 0) {
      const { yearOfManufacture } = this._contextData.vehicle;

      this.searchedBrands = await this.vehicleService.getBrands(this.form.value.searchInput, yearOfManufacture);
      this.searchedBrands = this.searchedBrands.filter(brand => brand !== this.selectedBrand);
      this.selectedBrand && this.searchedBrands.unshift(this.selectedBrand);

      this.notFound = this.searchedBrands.length === 0;
      return;
    }

    this.searchedBrands = [];
    this.notFound = this.iconBrands.length === 0;
  }

  /**
   * Actualiza el contexto guardando la marca seleccionada
   */
  private updateValidData = (): boolean => {
    return this._contextData.vehicle.brand === this.selectedBrand;
  };
}
