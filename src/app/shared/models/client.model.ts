/* eslint-disable @typescript-eslint/no-namespace */

export interface ClientModel {
  isClient?: boolean;
  isPolicyOwner?: boolean;
  accidents?: number;
}

export namespace ClientModel {
  export const init = (): ClientModel => ({});
}
