import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export const isFutureDate =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    moment(control.value).isAfter(moment()) ? { futureDate: true } : null;

export const isPastDate =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    moment(control.value).isBefore(moment()) ? { pastDate: true } : null;

export const isOlderThanYears =
  (years: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const bornDate = moment(control.value);
    const timeBetween = moment().diff(bornDate, 'years');

    return timeBetween < years ? { olderThanYears: true } : null;
  };

export const maxYearsBetweenDates =
  (date: Date, maxYears: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlDate = moment(control.value);
    const timeBetween = moment(date).diff(controlDate, 'years');

    return Math.abs(timeBetween) > maxYears ? { maxYearsBetweenDates: true } : null;
  };

export const minYearsBetweenDates =
  (date: Date, maxYears: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlDate = moment(control.value);
    const timeBetween = moment(date).diff(controlDate, 'years');

    return Math.abs(timeBetween) < maxYears ? { minYearsBetweenDates: true } : null;
  };

export const isBetweenDates = (startDate: Date, endDate: Date): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate = moment(control.value);
    const start = moment(startDate);
    const end = moment(endDate);

    // @howto make isBetween inclusive ingnoring time
    return controlDate.isBetween(start.startOf('day'), end.endOf('day'), undefined, '[)') ? null : { isBetweenDates: true };
  };
};
