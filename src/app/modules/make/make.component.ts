import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { IIconData, QuoteComponent } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { BrandService } from './services';

@Component({
  selector: 'quote-make',
  templateUrl: './make.component.html',
  styleUrl: './make.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    IconCardComponent,
    TextCardComponent,
    NxIconModule,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [VehicleService, BrandService],
  standalone: true
})
export class MakeComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public iconBrands!: IIconData[];
  public searchedMakes: string[] = [];
  public selectedBrand?: string;

  private subscription$: Subscription[] = [];

  private readonly routingService = inject(RoutingService);
  private readonly brandService = inject(BrandService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.createForm();

    const iconDictionary = await this.brandService.iconBrands();

    this.iconBrands = (await this.vehicleService.getBrands())
      .filter(brand => Object.keys(iconDictionary).includes(brand))
      .map(brand => ({ ...iconDictionary[brand], index: brand } as IIconData));

    this.selectedBrand = this.contextData.vehicle.make;

    this.searchBrands();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectMake(event: string): void {
    this.selectedBrand = event;

    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      make: this.selectedBrand!
    };

    this.routingService.next(this.contextData);
  }

  private createForm(): void {
    this.form = this.fb.group({
      searchInput: new FormControl(this.contextData.vehicle.make)
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
    this.searchedMakes = this.form.value.searchInput ? await this.vehicleService.getBrands(this.form.value.searchInput) : [];
  }

  /**
   * Actualiza el contexto guardando la marca seleccionada
   */
  private updateValidData = (): boolean => {
    return this.contextData.vehicle.make === this.selectedBrand;
  };
}
