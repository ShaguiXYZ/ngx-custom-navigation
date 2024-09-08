export type CompareOperations = 'AND' | 'OR';

export interface Configuration {
  lastUpdate?: Date;
  pageMap: Page[];
}

export interface Page {
  pageId: string;
  route: string;
  title: string;
  nextOptionList?: NextOption[];
  pageConfiguration?: any;
  step?: number;
  maxPath?: number;
  showAsBreadcrumb?: boolean;
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
