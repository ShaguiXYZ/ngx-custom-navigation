/* eslint-disable @typescript-eslint/no-namespace */

export interface InsuranceCompanyModel {
  company?: string;
}

export namespace InsuranceCompanyModel {
  export const init = (): InsuranceCompanyModel => ({});
}
