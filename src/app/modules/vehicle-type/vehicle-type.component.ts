import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';
import { VehicleTypes } from './models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'app-vehicle-type',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    IconCardComponent,
    TextCardComponent,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss'
})
export class VehicleTypeComponent implements OnInit, IsValidData {
  public vehicleTypes = VehicleTypes;
  public selectedType?: IndexedData;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedType = this.vehicleTypes.find(type => type.index === this.contextData.vehicle.vehicleTtype);
  }

  public canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public selectType(type: IndexedData) {
    this.selectedType = type;

    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      vehicleTtype: this.selectedType?.index
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private isValidData = (): boolean => {
    return !!this.contextData.vehicle.vehicleTtype;
  };
}
