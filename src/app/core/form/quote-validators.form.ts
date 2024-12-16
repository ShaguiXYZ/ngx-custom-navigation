import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteModel } from '../models';
import { ServiceActivatorService } from '../service-activators';
import { FormValidations, QuoteFormValidations } from './quote.form.model';

@Injectable()
export class QuoteFormValidarors {
  private readonly contextDataService = inject(ContextDataService);
  private readonly serviceActivatorService = inject(ServiceActivatorService);

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

  public isYoungerThanYears =
    (years: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const bornDate = moment(control.value);
      const timeBetween = moment().diff(bornDate, 'years');

      return this.activateEntryPoint(control, 'youngerThanYears', timeBetween > years);
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

  public required =
    (length: number = 0): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'required', !control.value || `${control.value}`.trim().length < length);

  public informed =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'required', !hasValue(control.value));

  public maxLenght = (maxLength: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'maxLenght', `${control.value}`.trim().length > maxLength);
  };

  public minLenght = (minLength: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'minLenght', `${control.value}`.trim().length < minLength);
  };

  public requiredTrue =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'requiredTrue', !control.value);

  public matches = (masks?: (string | RegExp)[], flags?: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!masks?.length) {
        return null;
      }

      const mask = masks.find(mask => new RegExp(mask, flags).test(control.value));

      return this.activateEntryPoint(control, 'matches', !mask);
    };
  };

  /**
   * Activates an entry point for a form control and updates the form validations in the context data.
   *
   * @param control - The form control to validate.
   * @param validationKey - The key representing the type of validation.
   * @param validationValue - A boolean indicating whether the validation is active.
   * @returns A validation error object if validation fails, otherwise null.
   */
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
      if (validationValue) {
        this.serviceActivatorService.activateEntryPoint(`form-${controlName}-${validationKey}`);
      }

      const {
        navigation: { lastPage }
      } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      const lastPageId = lastPage?.pageId;

      if (lastPageId) {
        const quote = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
        const controlValidation: FormValidations = { [controlName]: { [validationKey]: validationValue } };
        const pageValidations = { ...(quote.forms?.[lastPageId] ?? {}), ...controlValidation };
        const validationSettings = lastPage.configuration?.validationSettings?.[controlName]?.[validationKey];

        quote.forms = { ...quote.forms, [lastPageId]: pageValidations };

        if (validationSettings?.disabled) {
          return null;
        }
      }
    }

    return validation;
  };
}
