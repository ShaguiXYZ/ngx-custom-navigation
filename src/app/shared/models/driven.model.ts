/* eslint-disable @typescript-eslint/no-namespace */

export interface DrivenModel {
  hasDrivenLicense?: boolean;
  drivenLicense?: string;
  drivenLicenseDate?: Date;
  drivenLicenseCountry?: string;
}

export namespace DrivenModel {
  export const init = (): DrivenModel => ({});
}
