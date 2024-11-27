import { ValidationErrors } from '@angular/forms';

export type QuoteFormValidations =
  | 'betweenDates'
  | 'email'
  | 'futureDate'
  | 'maxYearsBetweenDates'
  | 'maxValues'
  | 'minYearsBetweenDates'
  | 'minValues'
  | 'notFound'
  | 'olderThanYears'
  | 'pastDate';

export type FormValidations = { [controlName: string]: ValidationErrors };
