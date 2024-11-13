import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { Step } from '../../shared/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, NextOption, Page, QuoteModel } from '../models';
import { ConditionService } from './condition.service';
import { ServiceActivatorService } from './service-activator.service';

@Injectable({ providedIn: 'root' })
export class RoutingService implements OnDestroy {
  private appContextData: AppContextData;

  private readonly subscrition$: Subscription[] = [];
  private readonly contextDataService = inject(ContextDataService);
  private readonly conditionService = inject(ConditionService);
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

  public next(data?: QuoteModel): Promise<boolean> {
    this.serviceActivatorService.activateService('nextPage');
    data && this.contextDataService.set(QUOTE_CONTEXT_DATA, data);

    const nextPage = this.getNextRoute();

    if (!nextPage) {
      return Promise.resolve(false);
    }

    return this._goToPage(nextPage);
  }

  public previous = (data?: QuoteModel): Promise<boolean> => {
    if (this.appContextData.navigation.viewedPages.length > 1) {
      const pageId = this.appContextData.navigation.viewedPages[this.appContextData.navigation.viewedPages.length - 2];

      this.serviceActivatorService.activateService('previousPage');
      data && this.contextDataService.set(QUOTE_CONTEXT_DATA, data);

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

    return this.router.navigate([Page.routeFrom(page)], { skipLocationChange: true });
    // return this._router.navigate([Page.routeFrom(page)]);
  };

  private getNextRoute(): Page | undefined {
    const pageId = this.appContextData.navigation.viewedPages[this.appContextData.navigation.viewedPages.length - 1];

    // 1º Recuperamos la pagina del sitemap
    const page = this.getPage(pageId);

    // 2º Recuperamos la opción de siguiente
    const nextPageId = this.testNavigation(page!);

    return this.appContextData.configuration.pageMap[nextPageId!];
  }

  private testNavigation(page: Page): string | undefined {
    if (page.nextOptionList) {
      return this.nextPageIdFromNextOptionList(page.nextOptionList);
    } else {
      return;
    }
  }

  /**
   * Devuelve el nextPageId que cumpla las condiciones, o en última instancia el nextPageId por defecto (último)
   */
  private nextPageIdFromNextOptionList(nextOptionList: NextOption[]): string | undefined {
    const nextOption = nextOptionList.find(nextOption => this.conditionService.checkConditions(nextOption.conditions));

    return nextOption?.nextPageId;
  }
}
