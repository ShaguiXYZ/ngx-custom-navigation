/* eslint-disable @typescript-eslint/no-namespace */

export interface InsuranceCompanyModel {
  company?: string;
  yearsAsOwner?: number;
}

export namespace InsuranceCompanyModel {
  export const init = (): InsuranceCompanyModel => ({});
}
