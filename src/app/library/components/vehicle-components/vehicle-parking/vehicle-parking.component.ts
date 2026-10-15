import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IndexedData } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QuoteComponent } from '../../../../core/components';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { VehicleParkingTypes } from './models';

@Component({
  selector: 'quote-vehicle-parking',
  templateUrl: './vehicle-parking.component.html',
  styleUrl: './vehicle-parking.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
