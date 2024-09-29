import { DataInfo } from '@shagui/ng-shagui/core';

export interface StepDTO {
  label: string;
  pages: string[];
}

export interface StepperDTO {
  title: string;
  steps: StepDTO[];
}

export interface Step {
  key: string;
  label: string;
}

export interface Stepper {
  title: string;
  steps: Step[];
}

export interface Steppers {
  steppersMap: DataInfo<Stepper>;
  pagesMap: DataInfo<{ stepperKey: string; stepKey: string }>;
}
