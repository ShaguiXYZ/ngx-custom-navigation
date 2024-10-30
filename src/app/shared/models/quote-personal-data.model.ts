/* eslint-disable @typescript-eslint/no-namespace */

export interface QuotePersonalDataModel {
  birthdate?: Date;
  email?: string;
  name: string;
  identificationNumber?: string;
  surname?: string;
  phoneNumber?: string;
}

export namespace QuotePersonalDataModel {
  export const init = (): QuotePersonalDataModel => ({ name: '' });
}
