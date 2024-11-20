/* eslint-disable @typescript-eslint/no-namespace */
export interface QuoteBlackList {
  email?: boolean;
  identificationNumber?: boolean;
  phoneNumber?: boolean;
  plateNumber?: boolean;
}

export namespace QuoteBlackList {
  export const init = (): QuoteBlackList => ({});
}
