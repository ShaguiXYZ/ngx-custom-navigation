import { animate, AnimationMetadata, group, keyframes, query, style, transition } from '@angular/animations';

const stepper = (): AnimationMetadata[] => [
  query(':enter, :leave', [
    style({
      position: 'absolute',
      left: 0,
      width: '100%'
    })
  ]),
  group([
    query(':enter', [
      animate(
        '2000ms ease',
        keyframes([
          style({ transform: 'scale(0) translateX(100%)', offset: 0 }),
          style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }),
          style({ transform: 'scale(1) translateX(0%)', offset: 1 })
        ])
      )
    ]),
    query(':leave', [
      animate(
        '2000ms ease',
        keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }),
          style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 })
        ])
      )
    ])
  ])
];

export const stepperTransitions = [transition('* <=> *', stepper())];
