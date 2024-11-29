import { DataInfo } from '@shagui/ng-shagui/core';
import { QuoteModel } from './quote.model';

export interface Stateless {
  inherited?: boolean;
  data?: QuoteModel;
  inData?: QuoteModel;
}

export interface StepDTO {
  label: string;
  pages: string[];
}

export interface StepperDTO {
  steps: StepDTO[];
  stateless?: boolean | Stateless;
}

export interface Step {
  key: string;
  label: string;
  pages: string[];
}

export interface Stepper {
  steps: Step[];
  stateless?: Stateless;
}

export interface Steppers {
  steppersMap: DataInfo<Stepper>;
}
