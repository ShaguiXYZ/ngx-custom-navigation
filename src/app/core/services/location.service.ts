import { inject, Injectable } from '@angular/core';
import { HttpService } from '@shagui/ng-shagui/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { LocationDTO, LocationModel } from '../models';
import { HttpStatusCode } from '@angular/common/http';

const LOCATION_API = '/location';

@Injectable()
export class LocationService {
  private readonly httpService = inject(HttpService);

  public getAddress = async (postalCode: string): Promise<LocationModel | undefined> => {
    try {
      const location = await firstValueFrom(
        this.httpService
          .get<LocationDTO>(`${LOCATION_API}/address/${postalCode}`, {
            responseStatusMessage: { [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' } }
          })
          .pipe(
            catchError(() => of(undefined)),
            map(res => res as LocationDTO)
          )
      ).catch(() => undefined);

      return location ? LocationModel.create(postalCode, location.province, location.location) : undefined;
    } catch (error) {
      console.error('Error fetching address:', error);
      return undefined;
    }
  };
}
