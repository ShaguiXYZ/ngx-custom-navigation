import { DataInfo } from '@shagui/ng-shagui/core';
import { ServiceActivator } from '../service-activators';
import { HeaderConfig } from './header-config.model';
import { LiteralModel } from './literal.model';
import { PageFormValidationSettings } from './page-form.model';
import { QuoteControlModel } from './quote-control.model';
import { QuoteFooterConfig } from './quote-footer-comfig.model';
import { Version, VersionInfo } from './quote-version.model';
import { StepperConfig } from './stepper-config.model';
import { Stepper, StepperDTO } from './stepper.model';

/**
 * Represents the possible logical comparison operations.
 *
 * The available operations are:
 * - 'AND': Logical AND operation.
 * - 'OR': Logical OR operation.
 * - 'XOR': Logical exclusive OR operation.
 * - 'NOR': Logical NOR (NOT OR) operation.
 * - 'NAND': Logical NAND (NOT AND) operation.
 * - 'XNOR': Logical equivalence (NOT XOR) operation.
 */
export type CompareOperations = 'AND' | 'OR' | 'XOR' | 'NOR' | 'NAND' | 'XNOR';
export type Links = DataInfo;
export type Literals = {
  header?: LiteralModel;
  subheader?: LiteralModel;
  body?: LiteralModel;
  'footer-next'?: LiteralModel;
} & DataInfo<LiteralModel>;

export interface JourneyInfo {
  id: string;
  versions?: VersionInfo[];
}

export interface ZoneConfig {
  skipLoad?: boolean;
  conditions?: Condition[];
}

export interface ConfigurationDTO<T extends QuoteControlModel = QuoteControlModel, K = string> {
  homePageId: string;
  title?: LiteralModel;
  errorPageId?: string;
  steppers?: StepperDTO[];
  pageMap: Page<T, K>[];
  links?: Links;
  literals?: Literals;
}

type PageData<T extends QuoteControlModel> = {
  contextData?: Partial<T>;
  headerConfig?: HeaderConfig;
  footerConfig?: QuoteFooterConfig;
  stepperConfig?: StepperConfig;
} & DataInfo<unknown>;

export interface PageConfiguration<T extends QuoteControlModel> {
  literals?: Literals;
  data?: PageData<T>;
  validationSettings?: PageFormValidationSettings;
  serviceActivators?: ServiceActivator[];
  zones?: Record<string, ZoneConfig>;
}

export interface Page<T extends QuoteControlModel = QuoteControlModel, K = string> {
  configuration?: PageConfiguration<T>;
  nextOptionList?: NextOption<K>[];
  pageId: K | string;
  component?: K;
  stepper?: { key: string; stepKey: string };
  routeTree?: string;
}

export interface NextOption<K = string> {
  nextPageId: K | string;
  conditions?: Condition[];
}

export interface Condition {
  expression: string;
  operation?: string;
  value: unknown;
  union?: CompareOperations;
}

export interface Configuration<T extends QuoteControlModel = QuoteControlModel, K = string> {
  hash?: string;
  name: string;
  version: { actual: Version; last?: Version };
  releaseDate?: Date;
  homePageId: K;
  title?: LiteralModel;
  errorPageId: K;
  pageMap: DataInfo<Page<T, K>>;
  steppers?: DataInfo<Stepper>;
  links?: Links;
  literals?: Literals;
}
