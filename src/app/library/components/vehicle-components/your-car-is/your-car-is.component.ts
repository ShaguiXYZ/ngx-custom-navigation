import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { NxMaskModule } from '@allianz/ng-aquila/mask';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuoteComponent } from '../../../../core/components';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel, QuoteVehicleModel } from '../../../models';
import { VehicleService } from '../../../services';

@Component({
  selector: 'quote-your-car-is',
  templateUrl: './your-car-is.component.html',
  styleUrl: './your-car-is.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    TextCardComponent,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule,
    QuoteLiteralPipe,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [VehicleService]
})
export class YourCarIsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public vehicleOptions: QuoteVehicleModel[] = [];
  public selectedVehicle?: QuoteVehicleModel;
  public notFound = false;

  private readonly routingService = inject(RoutingService);
  private readonly vehicleService = inject(VehicleService);

  async ngOnInit(): Promise<void> {
    this.selectedVehicle = !this._contextData.vehicle.notFound ? this._contextData.vehicle : {};

    if (this._contextData.vehicle.plateNumber) {
      this.vehicleOptions = await this.vehicleService.findByPlate(this._contextData.vehicle.plateNumber);
    } else {
      this.vehicleOptions = await this.vehicleService.vehicles();
    }

    this.notFound = this.vehicleOptions.length === 0;
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public selectVehicle(vehicle: QuoteVehicleModel) {
    this._contextData.vehicle = { ...this._contextData.vehicle, ...vehicle, notFound: false };

    this.routingService.next();
  }

  public continue() {
    this._contextData.vehicle.notFound = true;
    this.routingService.next();
  }

  private isValidData = (): boolean => this._contextData.vehicle.notFound || !!this._contextData.vehicle?.brand;
}
