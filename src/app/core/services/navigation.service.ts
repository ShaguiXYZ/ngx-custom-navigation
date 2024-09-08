import { inject, Injectable } from '@angular/core';
import { HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Configuration } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly http = inject(HttpService);

  public getConfiguration(): Promise<Configuration> {
    console.log('environment conf', environment);

    return firstValueFrom(this.http.get<Configuration>(environment.mockUrl).pipe(map(res => res as Configuration)));
  }
}
