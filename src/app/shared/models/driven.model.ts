/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
export interface DrivenModel {
  hasDrivenLicense?: boolean;
  drivenLicense?: string;
  drivenLicenseDate?: Date;
  drivenLicenseCountry?: string;
}

export namespace DrivenModel {
  export const init = (): DrivenModel => ({});
}
