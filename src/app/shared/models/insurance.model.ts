import { FormControl, FormGroup } from '@angular/forms';

export interface InsurancePageData {
  insured: string;
  company: string;
  lastPolicyNumbers: string;
  seniority: string;
  tirea: boolean;
  vehicleOwnershipSeniority: string;
  part: string;
  insuranceDate: string;
}

export type InsurancePageForm = {
  [key in keyof InsurancePageData]: FormGroup | FormControl;
};
