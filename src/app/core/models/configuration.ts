import { DataInfo } from '@shagui/ng-shagui/core';

export type CompareOperations = 'AND' | 'OR';

export interface ConfigurationDTO {
  homePageId: string;
  lastUpdate?: Date;
  pageMap: Page[];
}

export interface Page {
  nextOptionList?: NextOption[];
  pageConfiguration?: any;
  pageId: string;
  route: string;
  showBack?: boolean;
  title: string;
}

export interface NextOption {
  nextPageId: string;
  conditions?: Condition[];
}

export interface Condition {
  expression: string;
  operation?: string;
  value: any;
  union?: CompareOperations;
}

export interface Configuration {
  homePageId: string;
  lastUpdate?: Date;
  pageMap: DataInfo<Page>;
}

export namespace Configuration {
  export function init(configuration: ConfigurationDTO): Configuration {
    return {
      homePageId: configuration.homePageId,
      lastUpdate: configuration.lastUpdate,
      pageMap: configuration.pageMap.reduce((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {} as DataInfo<Page>)
    };
  }
}
