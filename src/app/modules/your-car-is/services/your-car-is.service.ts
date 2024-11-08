import { inject, Injectable } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteModel, QuoteVehicleModel } from 'src/app/core/models';
import { VehicleService } from 'src/app/core/services';

@Injectable()
export class YourCarIsService {
  private readonly contexDataService = inject(ContextDataService);
  private readonly vehicleService = inject(VehicleService);

  public findVehicles = (): Promise<QuoteVehicleModel[]> => {
    const contextData = this.contexDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    const { plateNumber } = contextData.vehicle;

    if (plateNumber) {
      return this.vehicleService.vehicles();
    }

    return this.vehicleService.vehicles();
  };
}
