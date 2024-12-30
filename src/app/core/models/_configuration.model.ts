import { DataInfo } from '@shagui/ng-shagui/core';
import { ServiceActivator } from '../service-activators';
import { HeaderConfig } from './header-config.model';
import { LiteralModel } from './literal.model';
import { PageFormValidationSettings } from './page-form.model';
import { QuoteFooterConfig } from './quote-footer-comfig.model';
import { Version, VersionInfo } from './quote-version.model';
import { StepperConfig } from './stepper-config.model';
import { Stepper, StepperDTO } from './stepper.model';
import { WorkflowComponent } from 'src/app/library/library-manifest';
import { QuoteControlModel } from './quote-control.model';

export type CompareOperations = 'AND' | 'OR';
export type Links = DataInfo;
export type Literals = {
  header?: LiteralModel;
  subheader?: LiteralModel;
  body?: LiteralModel;
  'footer-next'?: LiteralModel;
} & DataInfo<LiteralModel>;

export interface JourneyInfo {
  name: string;
  versions?: VersionInfo[];
}

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
}

type PageData = {
  contextData?: Partial<QuoteControlModel>;
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
  component?: WorkflowComponent;
  stepper?: { key: string; stepKey: string };
  routeTree?: string;
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
  name: string;
  version: { actual: Version; last?: Version };
  releaseDate?: Date;
  homePageId: string;
  title?: LiteralModel;
  errorPageId: string;
  pageMap: DataInfo<Page>;
  steppers?: DataInfo<Stepper>;
  links?: Links;
  literals?: Literals;
}
