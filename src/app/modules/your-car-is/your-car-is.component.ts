import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
import { IVehicleModel, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-your-car-is',
  templateUrl: './your-car-is.component.html',
  styleUrl: './your-car-is.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    SelectableOptionComponent,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteLiteralDirective
  ]
})
export class YourCarIsComponent implements OnInit, IsValidData {
  public vehicleOptions: IVehicleModel[] = [];
  public selectedVehicle?: IVehicleModel;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  async ngOnInit(): Promise<void> {
    this.footerConfig = {
      showBack: false,
      showNext: false
    };

    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedVehicle = this.contextData.vehicle;

    this.vehicleOptions = await this.vehicleService.vehicles();
  }

  public canDeactivate = (): boolean => !!this.selectedVehicle;

  public selectVehicle(vehicle: IVehicleModel) {
    this.contextData.vehicle = { ...this.contextData.vehicle, ...vehicle };
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  public continue() {
    this.selectVehicle(IVehicleModel.init());
  }
}
