import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { FuelTypes, IVehicleModel, QuoteModel } from 'src/app/shared/models';

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
    ReactiveFormsModule
  ]
})
export class YourCarIsComponent {
  public vehicleOptions: IVehicleModel[];
  public selectedVehicle?: IVehicleModel;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly fb: FormBuilder, private readonly _router: Router) {
    this.footerConfig = {
      showBack: false,
      showNext: false
    };

    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedVehicle = this.contextData.vehicle;

    //MOCK
    this.vehicleOptions = [
      {
        vehicleCode: 'AudiQ3Diesel1202015',
        make: 'Audi',
        model: 'Q3',
        fuel: { data: 'Diesel', index: FuelTypes.DIESEL },
        power: 120,
        yearOfManufacture: 2015
      },
      {
        vehicleCode: 'AudiQ3Diesel1302015',
        make: 'Audi',
        model: 'Q3',
        fuel: { data: 'Diesel', index: FuelTypes.DIESEL },
        power: 130,
        yearOfManufacture: 2015
      },
      {
        vehicleCode: 'AudiQ3Diesel1402015',
        make: 'Audi',
        model: 'Q3',
        fuel: { data: 'Diesel', index: FuelTypes.DIESEL },
        power: 140,
        yearOfManufacture: 2015
      },
      {
        vehicleCode: 'AudiQ3Diesel1502015',
        make: 'Audi',
        model: 'Q3',
        fuel: { data: 'Diesel', index: FuelTypes.DIESEL },
        power: 150,
        yearOfManufacture: 2015
      }
    ];
  }

  public selectVehicle(vehicle: IVehicleModel) {
    this.contextData.vehicle = { ...this.contextData.vehicle, ...vehicle };
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  public continue() {
    this.selectVehicle(IVehicleModel.init());
  }
}
