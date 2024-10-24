/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';

export interface InsuranceCompanyDTO {
  label: string;
  TIREASN: string;
  value: string;
}

export type InsuranceCompany = IndexedData;

export namespace InsuranceCompany {
  export const create = (data: InsuranceCompanyDTO): InsuranceCompany => ({
    index: data.value,
    data: data.label
  });
}
