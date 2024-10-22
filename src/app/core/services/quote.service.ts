import { inject, Injectable, OnDestroy } from '@angular/core';
import { ContextDataService, DataInfo, deepCopy } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { AppContextData, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuoteService implements OnDestroy {
  private lastPage?: Page;
  private pageData: DataInfo = {};

  private subscription: Subscription;

  private contextDataService = inject(ContextDataService);

  constructor() {
    this.subscription = this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
      this.lastPage = data.navigation.lastPage;
      this.pageData = { ...{}, ...this.lastPage?.configuration?.data };
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadComponentData = <T extends object>(component: T): void =>
    Object.entries(this.pageData).forEach(
      ([key, value]) => Object.prototype.hasOwnProperty.call(component, key) && Object.assign(component, { [key]: deepCopy(value) })
    );
}
