import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NxAutocompleteModule, NxAutocompleteSelectedEvent } from '@aposin/ng-aquila/autocomplete';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxPageSearchModule } from '@aposin/ng-aquila/page-search';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { BrandComponent } from 'src/app/shared/components/vehicle-selection';
import { IsValidData } from 'src/app/shared/guards';
import { BrandData, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-make',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    QuoteFooterComponent,
    BrandComponent,
    NxAutocompleteModule,
    NxIconModule,
    NxPageSearchModule,
    NxFormfieldModule,
    NxInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './make.component.html',
  styleUrl: './make.component.scss'
})
export class MakeComponent implements OnInit, OnDestroy, IsValidData {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public makes: string[];
  public searchedMakes: string[] = [];
  public footerConfig!: QuoteFooterConfig;
  public selectedMake?: string;

  private contextData!: QuoteModel;
  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  // Update constructor
  constructor(private readonly fb: FormBuilder, private readonly _router: Router) {
    this.makes = BrandData.iconBrands();
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.selectedMake = this.contextData.vehicle.make;
  }

  ngOnInit(): void {
    this.createForm();

    this.subscription$.push(this.searchBoxConfig());
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public canDeactivate = (): boolean => this.updateValidData();

  public selectAutocompleteMake(event: NxAutocompleteSelectedEvent): void {
    this.selectMake(event.option.value);
  }

  public selectMake(event: string): void {
    this.selectedMake = event;

    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      make: this.selectedMake!
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private createForm() {
    this.form = this.fb.group({
      searchInput: new FormControl(this.contextData.vehicle.make)
    });
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe(() => this.searchPlace());
  }

  private async searchPlace(): Promise<void> {
    this.searchedMakes = await this.vehicleService.vehicleBrands(this.form.value.searchInput);
  }

  /**
   * Actualiza el contexto guardando la marca seleccionada
   */
  private updateValidData = (): boolean => {
    return this.contextData.vehicle.make === this.selectedMake;
  };
}
