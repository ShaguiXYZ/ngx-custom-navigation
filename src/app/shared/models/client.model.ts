/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

export interface ClientModel {
  isClient?: boolean;
  isPolicyOwner?: boolean;
  accidents?: number;
}

export namespace ClientModel {
  export const init = (): ClientModel => ({});
}
