import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, Subscription } from 'rxjs';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { IsValidData } from 'src/app/shared/guards';
import { ModelVersionModel, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-vehicle-model-versions',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    IconCardComponent,
    SelectableOptionComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxIconModule,
    NxInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-model-versions.component.html',
  styleUrl: './vehicle-model-versions.component.scss'
})
export class VehicleModelVersionsComponent implements OnInit, OnDestroy, IsValidData {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public modelVersions: ModelVersionModel[] = [];
  public selectedModelVersion?: ModelVersionModel;

  private contextData!: QuoteModel;
  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  constructor(private readonly fb: FormBuilder, private _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  async ngOnInit(): Promise<void> {
    this.selectedModelVersion = this.contextData.vehicle.vehicleModelVersion;
    this.createForm();

    await this.filteredVersions();

    this.subscription$.push(this.searchBoxConfig());
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public canDeactivate = (
    currentRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    next?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> => this.updateValidData();

  public selectVersion(version: ModelVersionModel) {
    const navigateTo = this.routingService.getPage(this._router.url);

    this.selectedModelVersion = version;

    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      vehicleModelVersion: this.selectedModelVersion
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    return true;
  };

  private createForm() {
    this.form = this.fb.group({
      searchInput: new FormControl(this.selectedModelVersion?.data)
    });
  }

  private filteredVersions = (): Promise<void> =>
    this.vehicleService.vehicleModelVersions(this.contextData.vehicle.model!).then(versions => {
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
