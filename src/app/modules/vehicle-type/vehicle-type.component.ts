import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { IndexedData } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { VehicleTypes } from './models';

@Component({
  selector: 'quote-vehicle-type',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    TextCardComponent,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteTrackDirective,
    QuoteLiteralPipe
  ],
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss'
})
export class VehicleTypeComponent extends QuoteComponent implements OnInit {
  public vehicleTypes = VehicleTypes;
  public selectedType?: IndexedData;

  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.selectedType = this.vehicleTypes.find(type => type.index === this._contextData.vehicle.vehicleType);
  }

  public override canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public selectType(type: IndexedData) {
    this.selectedType = type;

    this._contextData.vehicle = {
      ...this._contextData.vehicle,
      vehicleType: this.selectedType?.index
    };

    this.routingService.next(this._contextData);
  }

  private isValidData = (): boolean => {
    return !!this._contextData.vehicle.vehicleType;
  };
}
