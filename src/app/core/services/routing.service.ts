import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, NextOption, Page, QuoteModel, Step } from '../models';
import { ServiceActivatorService } from '../service-activators';
import { AppUrls } from 'src/app/shared/config';

@Injectable({ providedIn: 'root' })
export class RoutingService implements OnDestroy {
  private appContextData: AppContextData;

  private readonly subscrition$: Subscription[] = [];
  private readonly contextDataService = inject(ContextDataService);
  private readonly serviceActivatorService = inject(ServiceActivatorService);
  private readonly router = inject(Router);

  constructor() {
    this.appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.subscrition$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
        this.appContextData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscrition$.forEach(sub => sub.unsubscribe());
  }

  public next = async (): Promise<boolean> => {
    await this.serviceActivatorService.activateEntryPoint('next-page');

    const toEveluate: QuoteModel = this.contextDataService.get(QUOTE_CONTEXT_DATA);
    const nextPage = this.getNextRoute(toEveluate);

    if (!nextPage) {
      return Promise.resolve(false);
    }

    return this._goToPage(nextPage);
  };

  public previous = async (): Promise<boolean> => {
    if (this.appContextData.navigation.viewedPages.length > 1) {
      await this.serviceActivatorService.activateEntryPoint('previous-page');

      const pageId = this.appContextData.navigation.viewedPages[this.appContextData.navigation.viewedPages.length - 2];

      return this._goToPage(this.appContextData.configuration.pageMap[pageId]);
    }

    return Promise.resolve(false);
  };

  public resetNavigation = (): Promise<boolean> => this.router.navigate(['/'], { skipLocationChange: true });

  public goToPage = (pageId: string): Promise<boolean> => this._goToPage(this.getPage(pageId)!);

  public goToStep = (step: Omit<Step, 'label'>): Promise<boolean> => {
    const pageId = this.appContextData.navigation.viewedPages.find(id => step.pages.includes(id))!;

    return this._goToPage(this.getPage(pageId)!);
  };

  private getPage = (id: string): Page | undefined => this.appContextData.configuration.pageMap[id];

  private _goToPage = (page: Page): Promise<boolean> => {
    this.appContextData.navigation.nextPage = page;
    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, this.appContextData);

    return this.router.navigate([AppUrls._dispatcher, page.pageId], { skipLocationChange: true });
  };

  private getNextRoute(data: QuoteModel): Page | undefined {
    const pageId = this.appContextData.navigation.viewedPages[this.appContextData.navigation.viewedPages.length - 1];
    const page = this.getPage(pageId);
    const nextPageId = this.testNavigation(data, page!);

    return this.appContextData.configuration.pageMap[nextPageId!];
  }

  private testNavigation(data: QuoteModel, page: Page): string | undefined {
    if (page.nextOptionList) {
      return this.nextPageIdFromNextOptionList(data, page.nextOptionList);
    } else {
      return;
    }
  }

  /**
   * Devuelve el nextPageId que cumpla las condiciones, o en última instancia el nextPageId por defecto (último)
   */
  private nextPageIdFromNextOptionList(data: QuoteModel, nextOptionList: NextOption[]): string | undefined {
    const nextOption = nextOptionList.find(nextOption => ConditionEvaluation.checkConditions(data, nextOption.conditions));

    return nextOption?.nextPageId;
  }
}
