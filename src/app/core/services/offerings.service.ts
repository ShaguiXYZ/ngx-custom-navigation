import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfferingDTO, OfferingModel } from '../models';

@Injectable({ providedIn: 'root' })
export class OfferingsService {
  private readonly httpService = inject(HttpService);

  public pricing(): Promise<OfferingModel> {
    return firstValueFrom(
      this.httpService
        .get<OfferingDTO>(`${environment.baseUrl}/offerings`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => OfferingModel.fromDTO(res as OfferingDTO)))
    );
  }
}
