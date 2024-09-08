import { Injectable, inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from '../../shared/models';
import { QUOTE_APP_CONTEXT_DATA_NAME, QUOTE_CONTEXT_DATA_NAME } from '../constants';
import { AppContextData, Configuration } from '../models';
import { NavigationService } from './navigation.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public configuration: Configuration = { pageMap: [] };

  private readonly contextDataService = inject(ContextDataService);
  private readonly navigationService = inject(NavigationService);
  private readonly translateService = inject(TranslateService);

  public async loadSettings() {
    this.translateService.setDefaultLang('es-ES');

    const contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);

    contextData ||
      this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, QuoteModel.init(), {
        persistent: false
      });

    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA_NAME);

    appContextData ||
      this.contextDataService.set(QUOTE_APP_CONTEXT_DATA_NAME, AppContextData.init(), {
        persistent: false
      });

    this.configuration = await this.navigationService.getConfiguration();

    console.log('configuration', this.configuration);
  }
}
