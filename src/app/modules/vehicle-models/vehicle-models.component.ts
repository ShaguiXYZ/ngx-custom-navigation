import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-vehicle-models',
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    TextCardComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxIconModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [VehicleService],
  standalone: true
})
export class VehicleModelsComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public models: string[] = [];
  public selectedModel?: string;

  private subscription$: Subscription[] = [];

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
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

    this.routingService.next(this.contextData);
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
