import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { QuoteFormValidarors } from '../quote-validators.form';

describe('QuoteFormValidarors', () => {
  let validators: QuoteFormValidarors;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuoteFormValidarors]
    });
    validators = TestBed.inject(QuoteFormValidarors);
  });

  it('should validate betweenDates correctly', () => {
    const control = new FormControl('2023-10-10');
    const validatorFn = validators.betweenDates(new Date('2023-10-01'), new Date('2023-10-20'));
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate betweenDates correctly', () => {
    const control = new FormControl('2023-09-30');
    const validatorFn = validators.betweenDates(new Date('2023-10-01'), new Date('2023-10-20'));
    const result = validatorFn(control);
    expect(result).toEqual({ betweenDates: true });
  });

  it('should validate isFutureDate correctly', () => {
    const control = new FormControl(moment().subtract(1, 'day').toISOString());
    const validatorFn = validators.isFutureDate();
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isFutureDate correctly', () => {
    const control = new FormControl(moment().add(1, 'day').toISOString());
    const validatorFn = validators.isFutureDate();
    const result = validatorFn(control);

    expect(result).toEqual({ futureDate: true });
  });

  it('should validate isPastDate correctly', () => {
    const control = new FormControl(moment().add(1, 'day').toISOString());
    const validatorFn = validators.isPastDate();
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isPastDate correctly', () => {
    const control = new FormControl(moment().subtract(1, 'day').toISOString());
    const validatorFn = validators.isPastDate();
    const result = validatorFn(control);
    expect(result).toEqual({ pastDate: true });
  });

  it('should validate isOlderThanYears correctly', () => {
    const control = new FormControl(moment().subtract(30, 'years').toISOString());
    const validatorFn = validators.isOlderThanYears(18);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isOlderThanYears correctly', () => {
    const control = new FormControl(moment().subtract(10, 'years').toISOString());
    const validatorFn = validators.isOlderThanYears(18);
    const result = validatorFn(control);
    expect(result).toEqual({ olderThanYears: true });
  });

  it('should validate maxYearsBetweenDates correctly', () => {
    const control = new FormControl(moment().subtract(5, 'years').toISOString());
    const validatorFn = validators.maxYearsBetweenDates(new Date(), 10);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate maxYearsBetweenDates correctly', () => {
    const control = new FormControl(moment().subtract(15, 'years').toISOString());
    const validatorFn = validators.maxYearsBetweenDates(new Date(), 10);
    const result = validatorFn(control);
    expect(result).toEqual({ maxYearsBetweenDates: true });
  });

  it('should validate maxValues correctly', () => {
    const control = new FormControl(5);
    const validatorFn = validators.maxValues(10);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate maxValues correctly', () => {
    const control = new FormControl(15);
    const validatorFn = validators.maxValues(10);
    const result = validatorFn(control);
    expect(result).toEqual({ maxValues: true });
  });

  it('should validate minYearsBetweenDates correctly', () => {
    const control = new FormControl(moment().subtract(5, 'years').toISOString());
    const validatorFn = validators.minYearsBetweenDates(new Date(), 3);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate minYearsBetweenDates correctly', () => {
    const control = new FormControl(moment().subtract(1, 'years').toISOString());
    const validatorFn = validators.minYearsBetweenDates(new Date(), 3);
    const result = validatorFn(control);
    expect(result).toEqual({ minYearsBetweenDates: true });
  });

  it('should validate minValues correctly', () => {
    const control = new FormControl(5);
    const validatorFn = validators.minValues(3);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate minValues correctly', () => {
    const control = new FormControl(1);
    const validatorFn = validators.minValues(3);
    const result = validatorFn(control);
    expect(result).toEqual({ minValues: true });
  });

  it('should validate email correctly', () => {
    const control = new FormControl('test@example.com');
    const validatorFn = validators.email();
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate email correctly', () => {
    const control = new FormControl('invalid-email');
    const validatorFn = validators.email();
    const result = validatorFn(control);
    expect(result).toEqual({ email: true });
  });
});
