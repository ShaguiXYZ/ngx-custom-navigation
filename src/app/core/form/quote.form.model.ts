import { ValidationErrors } from '@angular/forms';

export type QuoteFormValidation =
  | 'betweenDates'
  | 'email'
  | 'futureDate'
  | 'matches'
  | 'maxLenght'
  | 'maxYearsBetweenDates'
  | 'maxValues'
  | 'minLenght'
  | 'minYearsBetweenDates'
  | 'minValues'
  | 'notFound'
  | 'olderThanYears'
  | 'pastDate'
  | 'required'
  | 'requiredTrue'
  | 'youngerThanYears'
  | `@${string}`;

export type FormValidations = Record<string, ValidationErrors>;
