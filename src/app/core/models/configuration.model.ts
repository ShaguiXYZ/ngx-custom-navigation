/* eslint-disable @typescript-eslint/no-namespace */
import { DataInfo } from '@shagui/ng-shagui/core';
import { ServiceActivator } from '../service-activators';
import { HeaderConfig } from './header-config.model';
import { LiteralModel } from './literal.model';
import { PageFormValidationSettings } from './page-form.model';
import { QuoteFooterConfig } from './quote-footer-comfig.model';
import { Version, VersionInfo } from './quote-version.model';
import { QuoteModel } from './quote.model';
import { StepperDTO, Steppers } from './stepper.model';
import { StepperConfig } from './stepper-config.model';

export type CompareOperations = 'AND' | 'OR';
export type Links = DataInfo;
export type Literals = DataInfo<LiteralModel>;

export interface ZoneConfig {
  skipLoad?: boolean;
  conditions?: Condition[];
}

export interface ConfigurationDTO {
  homePageId: string;
  title?: LiteralModel;
  errorPageId?: string;
  steppers?: StepperDTO[];
  pageMap: Page[];
  links?: Links;
  literals?: Literals;
  version: VersionInfo[];
}

type PageData = {
  contextData?: Partial<QuoteModel>;
  headerConfig?: HeaderConfig;
  footerConfig?: QuoteFooterConfig;
  stepperConfig?: StepperConfig;
} & DataInfo<unknown>;

export interface PageConfiguration {
  literals?: Literals;
  data?: PageData;
  validationSettings?: PageFormValidationSettings;
  serviceActivators?: ServiceActivator[];
  zones?: Record<number, ZoneConfig>;
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
  hash?: string;
  name?: string;
  version: Version;
  releaseDate?: Date;
  homePageId: string;
  title?: LiteralModel;
  errorPageId: string;
  pageMap: DataInfo<Page>;
  steppers?: Steppers;
  links?: Links;
  literals?: Literals;
}
