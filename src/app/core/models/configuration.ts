/* eslint-disable @typescript-eslint/no-namespace */
import { DataInfo } from '@shagui/ng-shagui/core';
import { Steppers } from 'src/app/shared/models/stepper.model';

export type CompareOperations = 'AND' | 'OR';

export interface ConfigurationDTO {
  homePageId: string;
  lastUpdate?: Date;
  steppers?: Steppers;
  pageMap: Page[];
}

export interface Page {
  nextOptionList?: NextOption[];
  pageConfiguration?: unknown;
  pageId: string;
  route: string;
  showBack?: boolean;
  title: string;
}

export namespace Page {
  export const routeFrom = (page: Page): string => page.route ?? page.pageId;
}

export interface NextOption {
  nextPageId: string;
  conditions?: Condition[];
}

export interface Condition {
  expression: string;
  operation?: string;
  value: unknown;
  union?: CompareOperations;
}

export interface Configuration {
  homePageId: string;
  lastUpdate?: Date;
  pageMap: DataInfo<Page>;
}

export namespace Configuration {
  export const init = (configuration: ConfigurationDTO): Configuration => {
    return {
      homePageId: configuration.homePageId,
      lastUpdate: configuration.lastUpdate,
      pageMap: configuration.pageMap.reduce((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {} as DataInfo<Page>)
    };
  };
}
