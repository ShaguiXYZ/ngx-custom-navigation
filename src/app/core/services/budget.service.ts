import { inject, Injectable } from '@angular/core';
import { ContextDataService, StorageService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from '../constants';
import { QuoteModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly storageService = inject(StorageService);

  public storeBugdet(): void {
    const quote = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    console.log('quote', quote);
  }

  public retrieveBudget(budgetKey: string): void {
    const budget = localStorage.getItem(budgetKey);

    console.log('budget', budget);
  }
}
