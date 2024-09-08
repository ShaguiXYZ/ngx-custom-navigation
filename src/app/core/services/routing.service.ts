import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService, JsonUtils } from '@shagui/ng-shagui/core';
import { PageModel } from '../../shared/models';
import { QUOTE_CONTEXT_DATA_NAME } from '../constants';
import { CompareOperations, Condition, Configuration, NextOption, Page } from '../models';
import { SettingsService } from './setting.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private configuration: Configuration;
  private readonly contextDataService = inject(ContextDataService);

  constructor(private _router: Router, private settingsService: SettingsService) {
    this.configuration = this.settingsService.configuration;
  }

  public nextStep(validFn?: () => boolean, onError?: () => void): Promise<boolean> {
    if (!validFn || validFn()) {
      return this._router.navigate(this.getNextRoute(this._router.url));
    } else {
      onError && onError();
      return Promise.resolve(false);
    }
  }

  public previousStep(page: PageModel): Promise<boolean> {
    return this._router.navigate([page.id]);
  }

  public getPage(url: string): Page | undefined {
    return this.configuration.pageMap!.find(page => page.pageId === url.substring(1));
  }

  private getNextRoute(url: string): string[] {
    // 1º Recuperamos la pagina del sitemap
    const pagina = this.getPage(url);

    // 2º Recuperamos la opción de siguiente
    const nextPageId = this.testNavigation(pagina!);

    console.log('next page id', nextPageId);

    return nextPageId ? [nextPageId] : [];
  }

  private testNavigation(page: Page) {
    //1º Comprobamos si hay mas de una opción de siguiente
    if (page.nextOptionList && page.nextOptionList.length === 1) {
      // Cuando solo tenemos una opción de siguiente, esta no tendrá condiciones.
      // Las condiciones solo son condiciones de navegación, que sirven para decidir
      // a que pagina ir. Las condiciones de validaciones se realizarán por parte de
      // los propios componentes.
      return page.nextOptionList[0].nextPageId;
    } else if (page.nextOptionList && page.nextOptionList.length > 1) {
      return this.getNextPageIdFromNextOptionList(page.nextOptionList);
    } else {
      return undefined;
    }
  }

  /**
   * Devuelve el nextPageId que cumpla las condiciones, o en última instancia el nextPageId por defecto (último)
   */
  private getNextPageIdFromNextOptionList(nextOptionList: NextOption[]): string | undefined {
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
  private contextDataItemValue = (key: string): any => {
    const contextData = this.contextDataService.get(QUOTE_CONTEXT_DATA_NAME);

    return JsonUtils.valueOf(contextData, key);
  };

  private applyPreviousEval = (previous: boolean, current: boolean, union?: CompareOperations): boolean =>
    (union &&
      {
        ['AND']: previous && current,
        ['OR']: previous || current
      }[union]) ??
    current;
}
