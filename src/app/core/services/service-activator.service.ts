import { inject, Injectable } from '@angular/core';
import { AppContextData, EntryPoint } from '../models';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';

@Injectable({ providedIn: 'root' })
export class ServiceActivatorService {
  private readonly contextDataService = inject(ContextDataService);

  public activateService(entryPointId: string): void {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const { lastPage } = contextData.navigation;
    const entryPoints = lastPage?.entryPoints?.filter((entryPoint: EntryPoint) => entryPoint.id === entryPointId);

    console.log('entryPoints', entryPoints);
  }
}
