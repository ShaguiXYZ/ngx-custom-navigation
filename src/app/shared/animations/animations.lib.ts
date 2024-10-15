import { trigger } from '@angular/animations';
import { fadeTransitions } from './fade.animation';
import { slideTransitions } from './slide.animation';
import { stepperTransitions } from './stepper.animation';

const transitions = {
  fade: fadeTransitions,
  slide: slideTransitions,
  stepper: stepperTransitions
};

export const routeTransitions = (key: keyof typeof transitions) => trigger('routeTransitions', transitions[key]);
