/* eslint-disable @typescript-eslint/no-namespace */
import { DataInfo } from '@shagui/ng-shagui/core';
import { StepperDTO, Steppers } from 'src/app/shared/models/stepper.model';
import { LiteralModel } from './literal.model';

export type CompareOperations = 'AND' | 'OR';
export type Links = DataInfo;
export type Literals = DataInfo<LiteralModel>;

export interface ConfigurationDTO {
  homePageId: string;
  lastUpdate?: Date;
  steppers?: StepperDTO[];
  pageMap: Page[];
  links?: Links;
  literals?: Literals;
}

export interface PageConfiguration {
  literals?: Literals;
  data?: DataInfo<unknown>;
}

export interface Page {
  configuration?: PageConfiguration;
  nextOptionList?: NextOption[];
  pageId: string;
  route?: string;
  stepper?: { key: string; stepKey: string };
  routeTree?: string;
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
  steppers?: Steppers;
  links?: Links;
  literals?: Literals;
}
