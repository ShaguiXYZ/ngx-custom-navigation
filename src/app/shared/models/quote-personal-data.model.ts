/* eslint-disable @typescript-eslint/no-namespace */

export interface QuotePersonalDataModel {
  birthdate?: Date;
  email?: string;
  name: string;
  identificationNumber?: string;
  productsInfo?: boolean;
  privacyPolicy?: boolean;
  surname?: string;
  phoneNumber?: string;
}

export namespace QuotePersonalDataModel {
  export const init = (): QuotePersonalDataModel => ({ name: '', productsInfo: false });
}
