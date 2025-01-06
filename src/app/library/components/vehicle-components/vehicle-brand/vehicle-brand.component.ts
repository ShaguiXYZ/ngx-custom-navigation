import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
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
import { QuoteLiteralDirective } from 'src/app/shared/directives';
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
    NxIconModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    QuoteTrackDirective
  ],
  providers: [BrandComponentService, VehicleService],
  standalone: true
})
export class VehicleBrandComponent extends QuoteComponent<QuoteModel> implements OnInit {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public iconBrands!: IIconData[];
  public searchedBrands: string[] = [];
  public selectedBrand?: string;

  private readonly routingService = inject(RoutingService);
  private readonly brandComponentService = inject(BrandComponentService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.createForm();

    const iconDictionary = await this.brandComponentService.iconBrands();
    const brandList = await this.vehicleService.getBrands();

    this.iconBrands = brandList
      .filter(brand => Object.keys(iconDictionary).includes(brand))
      .map(brand => ({ ...iconDictionary[brand], index: brand, data: brand } as IIconData));

    this.selectedBrand = this._contextData.vehicle.brand;

    this.searchBrands();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectBrand(event: string): void {
    this.selectedBrand = event;

    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      brand: this.selectedBrand!
    };

    this.routingService.next();
  }

  private createForm(): void {
    this.form = this.fb.group({
      searchInput: new FormControl(this._contextData.vehicle.brand)
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
      .subscribe(() => this.searchBrands());
  }

  private async searchBrands(): Promise<void> {
    this.searchedBrands = this.form.value.searchInput ? await this.vehicleService.getBrands(this.form.value.searchInput) : [];
  }

  /**
   * Actualiza el contexto guardando la marca seleccionada
   */
  private updateValidData = (): boolean => {
    return this._contextData.vehicle.brand === this.selectedBrand;
  };
}
