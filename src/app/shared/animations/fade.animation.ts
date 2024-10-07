import { animate, state, style, transition, trigger } from '@angular/animations';

export const fade = trigger('fade', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: 1 })),

  transition(':enter, :leave', [animate(1000)])
]);
