/* eslint-disable @typescript-eslint/no-namespace */
export type Hour = `${number}:${number}`;

export interface ContactDataModel {
  contactHour?: Hour;
}

export namespace ContactDataModel {
  export const init = (): ContactDataModel => ({} as ContactDataModel);
}
