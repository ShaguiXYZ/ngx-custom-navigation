import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService, JsonUtils } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QuoteModel, Step } from '../../shared/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, CompareOperations, Condition, NextOption, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoutingService implements OnDestroy {
  private appContextData: AppContextData;

  private readonly subscrition$: Subscription[] = [];
  private readonly contextDataService = inject(ContextDataService);

  constructor(private readonly _router: Router) {
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

  public nextStep(): Promise<boolean> {
    const nextPage = this.getNextRoute();

    if (!nextPage) {
      return Promise.resolve(false);
    }

    return this._goToPage(nextPage);
  }

  public previousStep = (): Promise<boolean> => {
    if (this.appContextData.navigation.viewedPages.length > 1) {
      const pageId = this.appContextData.navigation.viewedPages[this.appContextData.navigation.viewedPages.length - 2];

      return this._goToPage(this.appContextData.configuration.pageMap[pageId]);
    }

    return Promise.resolve(false);
  };

  public goToPage = (pageId: string): Promise<boolean> => this._goToPage(this.getPage(pageId)!);

  public goToStep = (step: Step): Promise<boolean> => {
    const pageId = this.appContextData.navigation.viewedPages.find(id => step.pages.includes(id))!;

    return this._goToPage(this.getPage(pageId)!);
  };

  private getPage = (id: string): Page | undefined => this.appContextData.configuration.pageMap[id];

  private _goToPage = (page: Page): Promise<boolean> => {
    this.appContextData.navigation.nextPage = page;
    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, this.appContextData);

    return this._router.navigate([Page.routeFrom(page)], { skipLocationChange: true });
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
    const nextOption = nextOptionList.find(nextOption => this.checkConditions(nextOption.conditions));

    return nextOption?.nextPageId;
  }

  /**
   * Verifica si se cumplen las condiciones
   */
  private checkConditions = (conditions?: Condition[]): boolean =>
    conditions?.reduce((isValid: boolean, current: Condition) => {
      const currentEval = this.evalCondition(current);

      return this.applyPreviousEval(isValid, currentEval, current.union);
    }, true) ?? true;

  private evalCondition = (condition: Condition): boolean => {
    const contextExp = this.contextDataItemValue(condition.expression);

    return typeof contextExp === 'string'
      ? (0, eval)(`'${this.contextDataItemValue(condition.expression)}'${condition.operation ?? '==='}'${condition.value}'`)
      : (0, eval)(`${this.contextDataItemValue(condition.expression)}${condition.operation ?? '==='}${condition.value}`);
  };

  private contextDataItemValue = (key: string): unknown =>
    JsonUtils.valueOf(this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA), key);

  private applyPreviousEval = (previous: boolean, current: boolean, union?: CompareOperations): boolean =>
    (union &&
      {
        ['AND']: previous && current,
        ['OR']: previous || current
      }[union]) ??
    current;
}
