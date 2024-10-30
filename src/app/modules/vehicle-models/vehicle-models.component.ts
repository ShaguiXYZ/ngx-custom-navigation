import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from 'src/app/core/models';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-vehicle-models',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    IconCardComponent,
    TextCardComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxIconModule,
    NxInputModule,
    FormsModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss'
})
export class VehicleModelsComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public models: string[] = [];
  public selectedModel?: string;

  private contextData!: QuoteModel;
  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedModel = this.contextData.vehicle.model;

    this.vehicleService.getModels(this.contextData.vehicle.make, this.contextData.vehicle.model).then(models => {
      this.models = models;
    });

    this.createForm();

    this.subscription$.push(this.searchBoxConfig());
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectModel(model: string) {
    this.selectedModel = model;

    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      model: this.selectedModel
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => {
    return !!this.contextData.vehicle.model;
  };

  private createForm() {
    this.form = this.fb.group({
      searchInput: new FormControl(this.contextData.vehicle.model)
    });
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe(
        async () => (this.models = await this.vehicleService.getModels(this.contextData.vehicle.make, this.form.value.searchInput))
      );
  }
}
