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
  url: string;
}

export interface Stepper {
  steps: Step[];
}

export interface Steppers {
  steppersMap: DataInfo<Stepper>;
}
