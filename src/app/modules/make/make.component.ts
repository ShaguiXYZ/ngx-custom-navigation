import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { BrandData, QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { BrandComponent } from './components';

@Component({
  selector: 'quote-make',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    BrandComponent,
    TextCardComponent,
    NxIconModule,
    NxFormfieldModule,
    NxInputModule,
    FormsModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  templateUrl: './make.component.html',
  styleUrl: './make.component.scss'
})
export class MakeComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public makes!: string[];
  public searchedMakes: string[] = [];
  public footerConfig!: QuoteFooterConfig;
  public selectedMake?: string;

  private contextData!: QuoteModel;
  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.makes = BrandData.iconBrands();
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedMake = this.contextData.vehicle.make;

    this.createForm();
    this.searchBrands();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectMake(event: string): void {
    this.selectedMake = event;

    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      make: this.selectedMake!
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
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
    return this.contextData.vehicle.make === this.selectedMake;
  };
}
