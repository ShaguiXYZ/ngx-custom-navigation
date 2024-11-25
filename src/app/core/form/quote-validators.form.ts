import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import moment from 'moment';
import { ServiceActivatorService } from '../service-activators';
import { QuoteFormValidations } from './quote.form.model';

@Injectable()
export class QuoteFormValidarors {
  private readonly serviceActivatorService = inject(ServiceActivatorService);

  private validations: { [controlName: string]: ValidationErrors } = {};

  public betweenDates = (startDate: Date, endDate: Date): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value);
      const start = moment(startDate);
      const end = moment(endDate);

      // @howto make isBetween inclusive ingnoring time
      return this.activateEntryPoint(
        control,
        'betweenDates',
        !controlDate.isBetween(start.startOf('day'), end.endOf('day'), undefined, '[)')
      );
    };
  };

  public isFutureDate =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'futureDate', moment(control.value).isAfter(moment()));

  public isPastDate =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'pastDate', moment(control.value).isBefore(moment()));

  public isOlderThanYears =
    (years: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const bornDate = moment(control.value);
      const timeBetween = moment().diff(bornDate, 'years');

      return this.activateEntryPoint(control, 'olderThanYears', timeBetween < years);
    };

  public maxYearsBetweenDates =
    (date: Date, maxYears: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value);
      const timeBetween = moment(date).diff(controlDate, 'years');

      return this.activateEntryPoint(control, 'maxYearsBetweenDates', Math.abs(timeBetween) > maxYears);
    };

  public maxValues = (maxValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => this.activateEntryPoint(control, 'maxValues', control.value > maxValue);
  };

  public minYearsBetweenDates =
    (date: Date, maxYears: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value);
      const timeBetween = moment(date).diff(controlDate, 'years');

      return this.activateEntryPoint(control, 'minYearsBetweenDates', Math.abs(timeBetween) < maxYears);
    };

  public minValues = (minValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => this.activateEntryPoint(control, 'minValues', control.value < minValue);
  };

  public email = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

      return this.activateEntryPoint(control, 'email', !emailPattern.test(control.value));
    };
  };

  public activateEntryPoint = (
    control: AbstractControl,
    validationKey: QuoteFormValidations,
    validationValue: boolean
  ): ValidationErrors | null => {
    const validation = validationValue ? { [validationKey]: true } : null;

    const controlName = Object.keys(control.parent?.controls || {}).find(
      key => (control.parent?.controls as { [key: string]: AbstractControl })[key] === control
    );

    if (controlName) {
      if (validationValue && !this.validations[controlName]?.[validationKey]) {
        this.serviceActivatorService.activateEntryPoint(`form-${controlName}-${validationKey}`);
      }

      this.validations[controlName] = {
        ...this.validations[controlName],
        [validationKey]: validationValue
      };
    }

    return validation;
  };
}
