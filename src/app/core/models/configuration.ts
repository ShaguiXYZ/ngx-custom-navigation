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
  steppers: Steppers;
}

export namespace Configuration {
  export const init = (configuration: ConfigurationDTO): Configuration => {
    return {
      homePageId: configuration.homePageId,
      lastUpdate: configuration.lastUpdate,
      pageMap: configuration.pageMap.reduce((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {} as DataInfo<Page>),
      steppers: initSteppers(configuration.steppers)
    };
  };

  const initSteppers = (steppers?: StepperDTO[]): Steppers => {
    const steppersMap: DataInfo<Stepper> = {};
    const pagesMap: DataInfo<{ stepperKey: string; stepKey: string }> = {};

    if (!steppers) return { steppersMap, pagesMap };

    steppers.forEach(stepper => {
      const stepperKey = UniqueIds._next_();

      steppersMap[stepperKey] = {
        title: stepper.title,
        steps: stepper.steps.map(step => {
          const stepKey = UniqueIds._next_();

          step.pages.forEach(pageId => {
            pagesMap[pageId] = { stepperKey, stepKey };
          });

          return { key: stepKey, label: step.label };
        })
      };
    });

    return { steppersMap, pagesMap };
  };
}
