import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { ModelVersionModel, QuoteModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

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
  providers: [VehicleService]
})
export class VehicleModelVersionsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public modelVersions: ModelVersionModel[] = [];
  public selectedModelVersion?: ModelVersionModel;
  public notFound = false;

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
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(() => this.filteredVersions());
  }

  private filteredVersions = (): Promise<void> =>
    this.vehicleService.vehicleModelVersions(this._contextData.vehicle.model!).then(versions => {
      this.modelVersions = this.form.value.searchInput
        ? versions.filter(data => data.data?.toLocaleLowerCase().includes(this.form.value.searchInput?.toLocaleLowerCase()))
        : versions;
      this.notFound = this.modelVersions.length === 0;
    });
}
