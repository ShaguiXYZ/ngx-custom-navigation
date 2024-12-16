import { ValidationErrors } from '@angular/forms';

export type QuoteFormValidations =
  | 'betweenDates'
  | 'email'
  | 'futureDate'
  | 'matches'
  | 'maxYearsBetweenDates'
  | 'maxValues'
  | 'minYearsBetweenDates'
  | 'minValues'
  | 'notFound'
  | 'olderThanYears'
  | 'pastDate'
  | 'required'
  | 'requiredTrue'
  | 'youngerThanYears';

export type FormValidations = { [controlName: string]: ValidationErrors };
