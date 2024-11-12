import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { BrandData, QuoteComponent } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { BrandComponent } from './components';

@Component({
  selector: 'quote-make',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    BrandComponent,
    TextCardComponent,
    NxIconModule,
    NxFormfieldModule,
    NxInputModule,
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
  public selectedMake?: string;

  private subscription$: Subscription[] = [];

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.makes = BrandData.iconBrands();
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

    this.populateContextData();

    this.routingService.next();
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
