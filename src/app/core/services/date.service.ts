import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable()
export class DateService {
  private readonly shortDateFormatter: Intl.DateTimeFormat;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.shortDateFormatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * @returns Locale-dependent string ('DD/MM/YYYY' for Spain)
   */
  toLocaleDateString(dateInput: Date | string): string | null {
    const date = this.normalize(dateInput);

    return date ? this.shortDateFormatter.format(date) : null;
  }

  /**
   * @returns 'YYYY-MM-DD'
   */
  toISODateString(dateInput: Date | string): string | null {
    const date = this.normalize(dateInput);

    return date ? date.toISOString().substring(0, 10) : null;
  }

  /**
   * @returns YYYYMMDD
   */
  toISODateInteger(dateInput: Date | string): number {
    const date = this.normalize(dateInput);

    return date
      ? parseInt(
          `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`,
          10
        )
      : 0;
  }

  private normalize(date: Date | string): Date | undefined {
    if (date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }

      return isNaN(date.valueOf()) ? undefined : date;
    }

    return undefined;
  }
}
