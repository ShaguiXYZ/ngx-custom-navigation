import { DataInfo } from '@shagui/ng-shagui/core';
import { AppUrls } from '../config';

export interface Step {
  label: string;
  route: keyof typeof AppUrls;
}

export interface Stepper {
  title: string;
  steps: Step[];
}

export type Steppers = DataInfo<Stepper>;

export const steppers: Steppers = {
  main: {
    title: 'On boarding',
    steps: [
      {
        label: 'On boarding',
        route: 'onBoarding'
      }
    ]
  }
};
