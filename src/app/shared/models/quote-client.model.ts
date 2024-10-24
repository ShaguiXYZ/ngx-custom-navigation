/* eslint-disable @typescript-eslint/no-namespace */

export interface QuoteClientModel {
  isClient?: boolean;
  isPolicyOwner?: boolean;
  accidents?: number;
}

export namespace QuoteClientModel {
  export const init = (): QuoteClientModel => ({});
}
