import { DataInfo } from '@shagui/ng-shagui/core';
import { LiteralModel } from 'src/app/core/models';

export interface StepDTO {
  label: LiteralModel;
  pages: string[];
}

export interface StepperDTO {
  title: string;
  steps: StepDTO[];
}

export interface Step {
  key: string;
  label: LiteralModel;
  page: string;
}

export interface Stepper {
  steps: Step[];
}

export interface Steppers {
  steppersMap: DataInfo<Stepper>;
}
