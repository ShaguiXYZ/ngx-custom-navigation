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
import { VehicleTypes } from './models';

@Component({
  selector: 'quote-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss',
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
export class VehicleTypeComponent extends QuoteComponent<QuoteModel> implements OnInit {
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

    this.routingService.next();
  }

  private isValidData = (): boolean => !!this._contextData.vehicle.vehicleType;
}
