import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteControlModel } from '../models';
import { ServiceActivatorService } from '../service-activators';
import { FormValidations, QuoteFormValidation } from './quote.form.model';

dayjs.extend(isBetween);

@Injectable()
export class QuoteFormValidarors {
  private readonly contextDataService = inject(ContextDataService);
  private readonly serviceActivatorService = inject(ServiceActivatorService);

  public betweenDates = (startDate: Date, endDate: Date): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = dayjs(control.value);
      const start = dayjs(startDate);
      const end = dayjs(endDate);

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
      this.activateEntryPoint(control, 'futureDate', dayjs(control.value).isAfter(dayjs()));

  public isPastDate =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this.activateEntryPoint(control, 'pastDate', dayjs(control.value).isBefore(dayjs()));

  public isOlderThanYears =
    (years: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const bornDate = dayjs(control.value);
      const timeBetween = dayjs().diff(bornDate, 'years');

      return this.activateEntryPoint(control, 'olderThanYears', timeBetween < years);
    };

  public isYoungerThanYears =
    (years: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const bornDate = dayjs(control.value);
      const timeBetween = dayjs().diff(bornDate, 'years');

      return this.activateEntryPoint(control, 'youngerThanYears', timeBetween > years);
    };

  public maxYearsBetweenDates =
    (date: Date, maxYears: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const controlDate = dayjs(control.value);
      const timeBetween = dayjs(date).diff(controlDate, 'years');

      return this.activateEntryPoint(control, 'maxYearsBetweenDates', Math.abs(timeBetween) > maxYears);
    };

  public maxValues = (maxValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => this.activateEntryPoint(control, 'maxValues', control.value > maxValue);
  };

  public minYearsBetweenDates =
    (date: Date, maxYears: number): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const controlDate = dayjs(control.value);
      const timeBetween = dayjs(date).diff(controlDate, 'years');

      return this.activateEntryPoint(control, 'minYearsBetweenDates', Math.abs(timeBetween) < maxYears);
    };

  public minValues = (minValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => this.activateEntryPoint(control, 'minValues', control.value < minValue);
  };

  public required =
    (length = 0): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const value = typeof control.value === 'string' ? control.value.trim() : control.value;

      return this.activateEntryPoint(control, 'required', !value || `${value}`.length < length);
    };

  public informed =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const value = typeof control.value === 'string' ? control.value.trim() : control.value;

      return this.activateEntryPoint(control, 'required', !hasValue(value));
    };

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
    validationKey: QuoteFormValidation,
    validationValue: boolean
  ): ValidationErrors | null => {
    const controlName = Object.keys(control.parent?.controls ?? {}).find(
      key => (control.parent?.controls as Record<string, AbstractControl>)[key] === control
    );

    if (controlName) {
      if (validationValue) {
        this.serviceActivatorService.activateEntryPoint(`#${controlName}-${validationKey}`);
      }

      const {
        navigation: { lastPage }
      } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      const lastPageId = lastPage?.pageId;

      if (lastPageId) {
        const quote = this.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);
        const controlValidation: FormValidations = { [controlName]: { [validationKey]: validationValue } };
        const pageValidations = { ...(quote.forms?.[lastPageId] ?? {}), ...controlValidation };
        const validationSettings = lastPage.configuration?.validationSettings?.[controlName]?.[validationKey];

        quote.forms = { ...quote.forms, [lastPageId]: pageValidations };

        if (validationSettings?.disabled) {
          return null;
        }
      }
    }

    return validationValue ? { [validationKey]: true } : null;
  };
}
