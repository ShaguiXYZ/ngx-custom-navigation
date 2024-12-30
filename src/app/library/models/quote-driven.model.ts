/* eslint-disable @typescript-eslint/no-namespace */

export interface QuoteDrivenModel {
  hasDrivenLicense?: boolean;
  license?: string;
  licenseDate?: Date;
  licenseCountry?: string;
}

export namespace QuoteDrivenModel {
  export const init = (): QuoteDrivenModel => ({});
}
