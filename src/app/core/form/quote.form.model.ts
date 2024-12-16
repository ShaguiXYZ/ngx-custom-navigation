import { ValidationErrors } from '@angular/forms';

export type QuoteFormValidations =
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
  | 'youngerThanYears';

export type FormValidations = { [controlName: string]: ValidationErrors };
