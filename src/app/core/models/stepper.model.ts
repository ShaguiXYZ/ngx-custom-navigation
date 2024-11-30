import { DataInfo } from '@shagui/ng-shagui/core';

export interface StateInfo {
  inherited?: boolean;
}

export interface StepDTO {
  label: string;
  pages: string[];
}

export interface StepperDTO {
  steps: StepDTO[];
  stateInfo?: boolean | StateInfo;
}

export interface Step {
  key: string;
  label: string;
  pages: string[];
}

export interface Stepper {
  steps: Step[];
  stateInfo?: StateInfo;
}

export interface Steppers {
  steppersMap: DataInfo<Stepper>;
}
