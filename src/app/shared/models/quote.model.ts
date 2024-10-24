/* eslint-disable @typescript-eslint/no-namespace */
import { QuoteClientModel } from './quote-client.model';
import { QuoteContactDataModel } from './quote-contact-data.model';
import { QuoteDateOfIssueModel } from './quote-date-of-issue.model';
import { QuoteDrivenModel } from './quote-driven.model';
import { QuoteInsuranceCompanyModel } from './quote-insurance-company.model';
import { QuoteOfferingModel } from './quote-offering.model';
import { QuotePersonalDataModel } from './quote-personal-data.model';
import { QuotePlaceModel } from './quote-place.model';
import { QuoteVehicleModel } from './quote-vehicle.model';

export interface QuoteModel {
  client: QuoteClientModel;
  contactData: QuoteContactDataModel;
  dateOfIssue: QuoteDateOfIssueModel;
  driven: QuoteDrivenModel;
  insuranceCompany: QuoteInsuranceCompanyModel;
  offering: QuoteOfferingModel;
  personalData: QuotePersonalDataModel;
  place: QuotePlaceModel;
  vehicle: QuoteVehicleModel;
}

export namespace QuoteModel {
  export const init = (): QuoteModel => ({
    client: QuoteClientModel.init(),
    contactData: QuoteContactDataModel.init(),
    dateOfIssue: QuoteDateOfIssueModel.init(),
    driven: QuoteDrivenModel.init(),
    insuranceCompany: QuoteInsuranceCompanyModel.init(),
    personalData: QuotePersonalDataModel.init(),
    place: QuotePlaceModel.init(),
    vehicle: QuoteVehicleModel.init(),
    offering: QuoteOfferingModel.init()
  });
}
