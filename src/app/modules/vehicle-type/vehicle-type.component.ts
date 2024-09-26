import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteFooterService } from 'src/app/shared/components/quote-footer/services';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';
import { VehicleTypes } from './models';

@Component({
  selector: 'app-vehicle-type',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, IconCardComponent, SelectableOptionComponent, NxCopytextModule],
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss'
})
export class VehicleTypeComponent implements IsValidData {
  public vehicleTypes = VehicleTypes;
  public selectedType?: IndexedData;

  private readonly contextDataService = inject(ContextDataService);
  private readonly footerService = inject(QuoteFooterService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  constructor(private _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedType = this.vehicleTypes.find(type => type.index === this.contextData.vehicle.vehicleTtype);
  }

  public canDeactivate = (
    currentRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    next?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> => this.updateValidData();

  public selectType(type: IndexedData) {
    const navigateTo = this.routingService.getPage(this._router.url);

    this.selectedType = type;

    this.footerService.nextStep({
      showBack: true,
      showNext: !!navigateTo?.nextOptionList
    });
  }

  private updateValidData = (): boolean => {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      vehicleTtype: this.selectedType?.index
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    return true;
  };
}
