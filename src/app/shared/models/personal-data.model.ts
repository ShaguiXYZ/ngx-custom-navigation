/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

export interface PersonalDataModel {
  birthdate?: Date;
  email?: string;
  name: string;
  identificationNumber?: string;
  productsInfo?: boolean;
  privacyPolicy?: boolean;
  surname?: string;
  phoneNumber?: string;
}

export namespace PersonalDataModel {
  export const init = (): PersonalDataModel => ({ name: '', productsInfo: false });
}
