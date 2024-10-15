/**
 * Source: https://fireship.io/lessons/angular-router-animations/
 */
import { animate, AnimationMetadata, query, state, style, transition, trigger } from '@angular/animations';

const fader = (): AnimationMetadata[] => [
  // Set a default  style for enter and leave
  query(
    ':enter, :leave',
    [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0) translateY(100%)'
      })
    ],
    { optional: true }
  ),
  // Animate the new page in
  query(':enter', [animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))])
];

export const fadeTransitions = [transition('* <=> *', fader())];
