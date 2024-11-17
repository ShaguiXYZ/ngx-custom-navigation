import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { ModelVersionModel, QuoteComponent } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-vehicle-model-versions',
  templateUrl: './vehicle-model-versions.component.html',
  styleUrl: './vehicle-model-versions.component.scss',
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
    QuoteTrackDirective,
    QuoteLiteralPipe
  ],
  providers: [VehicleService],
  standalone: true
})
export class VehicleModelVersionsComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public modelVersions: ModelVersionModel[] = [];
  public selectedModelVersion?: ModelVersionModel;

  private subscription$: Subscription[] = [];

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.selectedModelVersion = this._contextData.vehicle.vehicleModelVersion;
    this.createForm();

    await this.filteredVersions();

    this.subscription$.push(this.searchBoxConfig());
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectVersion(version: ModelVersionModel) {
    this.selectedModelVersion = version;

    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      vehicleModelVersion: this.selectedModelVersion
    };

    this.routingService.next(this._contextData);
  }

  private updateValidData = (): boolean => {
    return !!this._contextData.vehicle.vehicleModelVersion;
  };

  private createForm() {
    this.form = this.fb.group({
      searchInput: new FormControl(this.selectedModelVersion?.data)
    });
  }

  private filteredVersions = (): Promise<void> =>
    this.vehicleService.vehicleModelVersions(this._contextData.vehicle.model!).then(versions => {
      this.modelVersions = this.form.value.searchInput
        ? versions.filter(data => data.data?.toLocaleLowerCase().includes(this.form.value.searchInput?.toLocaleLowerCase()))
        : versions;
    });

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe(() => this.filteredVersions());
  }
}
