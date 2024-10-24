/* eslint-disable @typescript-eslint/no-namespace */
export type Hour = `${number}:${number}`;

export interface QuoteContactDataModel {
  contactHour?: Hour;
}

export namespace QuoteContactDataModel {
  export const init = (): QuoteContactDataModel => ({} as QuoteContactDataModel);
}
