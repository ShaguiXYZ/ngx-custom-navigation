/* eslint-disable @typescript-eslint/no-namespace */

import { IndexedData } from '@shagui/ng-shagui/core';

export interface QuoteInsuranceCompanyModel {
  company?: IndexedData;
  yearsAsOwner?: number;
}

export namespace QuoteInsuranceCompanyModel {
  export const init = (): QuoteInsuranceCompanyModel => ({});
}
