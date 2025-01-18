import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import dayjs from 'dayjs';
import { NX_WORKFLOW_TOKEN } from '../../components/models';
import { QuoteFormValidarors } from '../quote-validators.form';

describe('QuoteFormValidarors', () => {
  const mockConfig = {
    errorPageId: 'error',
    manifest: {}
  };
  let validators: QuoteFormValidarors;

  beforeEach(() => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        QuoteFormValidarors,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
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
    const control = new FormControl(dayjs().subtract(1, 'day').toISOString());
    const validatorFn = validators.isFutureDate();
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isFutureDate correctly', () => {
    const control = new FormControl(dayjs().add(1, 'day').toISOString());
    const validatorFn = validators.isFutureDate();
    const result = validatorFn(control);

    expect(result).toEqual({ futureDate: true });
  });

  it('should validate isPastDate correctly', () => {
    const control = new FormControl(dayjs().add(1, 'day').toISOString());
    const validatorFn = validators.isPastDate();
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isPastDate correctly', () => {
    const control = new FormControl(dayjs().subtract(1, 'day').toISOString());
    const validatorFn = validators.isPastDate();
    const result = validatorFn(control);
    expect(result).toEqual({ pastDate: true });
  });

  it('should validate isOlderThanYears correctly', () => {
    const control = new FormControl(dayjs().subtract(30, 'years').toISOString());
    const validatorFn = validators.isOlderThanYears(18);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isOlderThanYears correctly', () => {
    const control = new FormControl(dayjs().subtract(10, 'years').toISOString());
    const validatorFn = validators.isOlderThanYears(18);
    const result = validatorFn(control);
    expect(result).toEqual({ olderThanYears: true });
  });

  it('should validate isYoungerThanYears correctly', () => {
    const control = new FormControl(dayjs().subtract(10, 'years').toISOString());
    const validatorFn = validators.isYoungerThanYears(18);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate isYoungerThanYears correctly', () => {
    const control = new FormControl(dayjs().subtract(30, 'years').toISOString());
    const validatorFn = validators.isYoungerThanYears(18);
    const result = validatorFn(control);
    expect(result).toEqual({ youngerThanYears: true });
  });

  it('should validate maxYearsBetweenDates correctly', () => {
    const control = new FormControl(dayjs().subtract(5, 'years').toISOString());
    const validatorFn = validators.maxYearsBetweenDates(new Date(), 10);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate maxYearsBetweenDates correctly', () => {
    const control = new FormControl(dayjs().subtract(15, 'years').toISOString());
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
    const control = new FormControl(dayjs().subtract(5, 'years').toISOString());
    const validatorFn = validators.minYearsBetweenDates(new Date(), 3);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should invalidate minYearsBetweenDates correctly', () => {
    const control = new FormControl(dayjs().subtract(1, 'years').toISOString());
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
});
