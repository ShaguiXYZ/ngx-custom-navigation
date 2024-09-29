import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QuoteModel } from '../../shared/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, Configuration, ConfigurationDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly translateService = inject(TranslateService);

  public async loadSettings(): Promise<void> {
    this.translateService.setDefaultLang('es-ES');

    const contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.contextDataService.set(
      QUOTE_CONTEXT_DATA,
      { ...QuoteModel.init(), ...contextData },
      {
        persistent: true
      }
    );

    const configuration = await firstValueFrom(
      this.httpService.get<ConfigurationDTO>(environment.mockUrl).pipe(
        map(res => res as ConfigurationDTO),
        map(Configuration.init)
      )
    );
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, AppContextData.init(configuration, appContextData?.navigation.viewedPages ?? []), {
      persistent: true
    });

    console.log(QUOTE_CONTEXT_DATA, this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA));
    console.log(QUOTE_APP_CONTEXT_DATA, this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA));
  }
}
