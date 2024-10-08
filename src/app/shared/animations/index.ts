/**
 * Source: https://fireship.io/lessons/angular-router-animations/
 */
import { AnimationMetadata, trigger } from '@angular/animations';
import { fadeTransitions } from './fade.animation';
import { slideTransitions } from './slide.animation';
import { stepperTransitions } from './stepper.animation';

export * from './fade.animation';
export * from './slide.animation';
export * from './stepper.animation';

export const optional = { optional: true };

const transitions = {
  fade: fadeTransitions,
  slide: slideTransitions,
  stepper: stepperTransitions
};

export const routeTransitions = (key: keyof typeof transitions) => trigger('routeTransitions', transitions[key]);
