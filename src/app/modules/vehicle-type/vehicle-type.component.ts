import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent } from 'src/app/shared/components';
import { QuoteFooterService } from 'src/app/shared/components/quote-footer/services';
import { QuoteModel } from 'src/app/shared/models';
import { VehicleTypes } from './models';

@Component({
  selector: 'app-vehicle-type',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, IconCardComponent, NxCopytextModule],
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss'
})
export class VehicleTypeComponent {
  public vehicleTypes = VehicleTypes;
  public selectedType?: IndexedData;

  private readonly contextDataService = inject(ContextDataService);
  private readonly footerService = inject(QuoteFooterService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  constructor(private _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);
    this.selectedType = this.vehicleTypes.find(type => type.index === this.contextData.vehicle.vehicleTtype);

    console.log('context data', this.contextData);
  }

  public selectType(type: IndexedData) {
    const navigateTo = this.routingService.getPage(this._router.url);

    this.selectedType = type;

    this.footerService.nextStep({
      validationFn: this.updateValidData,
      showBack: true,
      showNext: !!navigateTo?.nextOptionList
    });
  }

  private updateValidData = (): boolean => {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      vehicleTtype: this.selectedType?.index
    };

    console.log('saving context data', this.contextData);

    this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);

    return true;
  };
}
