/* eslint-disable @typescript-eslint/no-namespace */

export interface QuoteDrivenModel {
  hasDrivenLicense?: boolean;
  drivenLicense?: string;
  drivenLicenseDate?: Date;
  drivenLicenseCountry?: string;
}

export namespace QuoteDrivenModel {
  export const init = (): QuoteDrivenModel => ({});
}
