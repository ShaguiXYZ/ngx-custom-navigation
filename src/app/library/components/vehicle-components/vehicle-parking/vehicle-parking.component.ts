import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { IndexedData } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { VehicleParkingTypes } from './models';

@Component({
    selector: 'quote-vehicle-parking',
    templateUrl: './vehicle-parking.component.html',
    styleUrl: './vehicle-parking.component.scss',
    imports: [
        CommonModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        TextCardComponent,
        NxCopytextModule,
        QuoteLiteralDirective,
        QuoteTrackDirective,
        QuoteLiteralPipe
    ]
})
export class VehicleParkingComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public vehicleParkingTypes = VehicleParkingTypes;
  public selectedType?: IndexedData;

  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.selectedType = this.vehicleParkingTypes.find(type => type.index === this._contextData.vehicle.vehicleParkingType);
  }

  public override canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public selectType(type: IndexedData) {
    this.selectedType = type;

    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      vehicleParkingType: this.selectedType?.index
    };

    this.routingService.next();
  }

  private isValidData = (): boolean => {
    return !!this._contextData.vehicle.vehicleParkingType;
  };
}
