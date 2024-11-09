import { FormControl } from '@angular/forms';
import moment from 'moment';
import { isBetweenDates, isFutureDate, isOlderThanYears, isPastDate, maxYearsBetweenDates, minYearsBetweenDates } from '../validators.form';

describe('Validators', () => {
  it('should validate future date', () => {
    const control = new FormControl(moment().add(1, 'day').toISOString());
    expect(isFutureDate()(control)).toEqual({ futureDate: true });

    control.setValue(moment().subtract(1, 'day').toISOString());
    expect(isFutureDate()(control)).toBeNull();
  });

  it('should validate past date', () => {
    const control = new FormControl(moment().subtract(1, 'day').toISOString());
    expect(isPastDate()(control)).toEqual({ pastDate: true });

    control.setValue(moment().add(1, 'day').toISOString());
    expect(isPastDate()(control)).toBeNull();
  });

  it('should validate older than years', () => {
    const control = new FormControl(moment().subtract(10, 'years').toISOString());
    expect(isOlderThanYears(5)(control)).toBeNull();
    expect(isOlderThanYears(15)(control)).toEqual({ olderThanYears: true });
  });

  it('should validate max years between dates', () => {
    const control = new FormControl(moment().subtract(5, 'years').toISOString());
    const date = new Date();
    expect(maxYearsBetweenDates(date, 10)(control)).toBeNull();
    expect(maxYearsBetweenDates(date, 3)(control)).toEqual({ maxYearsBetweenDates: true });
  });

  it('should validate min years between dates', () => {
    const control = new FormControl(moment().subtract(5, 'years').toISOString());
    const date = new Date();
    expect(minYearsBetweenDates(date, 3)(control)).toBeNull();
    expect(minYearsBetweenDates(date, 10)(control)).toEqual({ minYearsBetweenDates: true });
  });

  it('should validate is between dates', () => {
    const startDate = moment().subtract(5, 'days').toDate();
    const endDate = moment().add(5, 'days').toDate();
    const control = new FormControl(moment().toISOString());

    expect(isBetweenDates(startDate, endDate)(control)).toBeNull();

    control.setValue(moment().subtract(10, 'days').toISOString());
    expect(isBetweenDates(startDate, endDate)(control)).toEqual({ isBetweenDates: true });

    control.setValue(moment().add(10, 'days').toISOString());
    expect(isBetweenDates(startDate, endDate)(control)).toEqual({ isBetweenDates: true });
  });
});
