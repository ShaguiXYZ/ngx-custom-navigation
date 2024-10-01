/* eslint-disable @typescript-eslint/no-namespace */
import { DataInfo, UniqueIds } from '@shagui/ng-shagui/core';
import { Stepper, StepperDTO, Steppers } from 'src/app/shared/models/stepper.model';

export type CompareOperations = 'AND' | 'OR';

export interface ConfigurationDTO {
  homePageId: string;
  lastUpdate?: Date;
  steppers?: StepperDTO[];
  pageMap: Page[];
}

export interface Page {
  nextOptionList?: NextOption[];
  pageConfiguration?: unknown;
  pageId: string;
  route: string;
  stepper?: { key: string; stepKey: string };
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
  steppers?: Steppers;
}

export namespace Configuration {
  export const init = (configuration: ConfigurationDTO): Configuration => {
    const quoteConfiguration: Configuration = initQuote(configuration);

    initSteppers(quoteConfiguration, configuration.steppers);

    return quoteConfiguration;
  };

  const initQuote = (configuration: ConfigurationDTO): Configuration => {
    return {
      homePageId: configuration.homePageId,
      lastUpdate: configuration.lastUpdate,
      pageMap: configuration.pageMap.reduce((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {} as DataInfo<Page>)
    };
  };

  const initSteppers = (configuration: Configuration, steppers?: StepperDTO[]): void => {
    const steppersMap: DataInfo<Stepper> = {};

    if (!steppers) return;

    steppers.forEach(stepper => {
      const stepperKey = UniqueIds._next_();

      steppersMap[stepperKey] = {
        steps: stepper.steps
          .filter(step => step.pages?.length)
          .map(step => {
            const stepKey = UniqueIds._next_();

            step.pages.forEach(pageId => {
              const page = configuration.pageMap[pageId];
              if (page) page.stepper = { key: stepperKey, stepKey };
            });

            return { key: stepKey, label: step.label, url: step.pages[0] };
          })
      };
    });

    configuration.steppers = { steppersMap };
  };
}
