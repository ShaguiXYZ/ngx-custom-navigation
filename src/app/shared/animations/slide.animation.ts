import { AnimationMetadata, animate, animateChild, group, query, style, transition } from '@angular/animations';

type Direction = 'left' | 'right';

const slideTo = (direction: Direction): AnimationMetadata[] => {
  return [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          [direction]: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ [direction]: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('200ms ease', style({ [direction]: '100%' }))], { optional: true }),
      query(':enter', [animate('200ms ease', style({ [direction]: '0%' }))], { optional: true })
    ])
  ];
};

const animationFade: AnimationMetadata[] = [
  query(
    ':enter',
    [
      style({
        opacity: 0,
        position: 'absolute',
        height: '100%',
        width: '100%'
      })
    ],
    { optional: true }
  ),
  query(
    ':leave',
    // here we apply a style and use the animate function to apply the style over 0.3 seconds
    [
      style({
        opacity: 1,
        position: 'absolute',
        height: '100%',
        width: '100%'
      }),
      animate('200ms ease', style({ opacity: 0 }))
    ],
    { optional: true }
  ),
  query(
    ':enter',
    [
      style({
        opacity: 0,
        position: 'relative',
        height: '100%',
        width: '100%'
      }),
      animate('200ms ease', style({ opacity: 1 }))
    ],
    { optional: true }
  )
];

export const slideTransitions = [
  transition('void => *', slideTo('right')),
  transition(':increment', slideTo('right')),
  transition(':decrement', slideTo('left')),
  transition(':enter', animationFade),
  transition('* <=> *', animationFade)
];
