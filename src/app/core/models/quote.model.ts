/* eslint-disable @typescript-eslint/no-namespace */
import { QuoteBlackList } from './quote-black-list.model';
import { QuoteClientModel } from './quote-client.model';
import { QuoteContactDataModel } from './quote-contact-data.model';
import { QuoteDrivenModel } from './quote-driven.model';
import { QuoteInsuranceCompanyModel } from './quote-insurance-company.model';
import { QuoteOfferingModel } from './quote-offering.model';
import { QuotePersonalDataModel } from './quote-personal-data.model';
import { QuotePlaceModel } from './quote-place.model';
import { QuoteVehicleModel } from './quote-vehicle.model';
import { QuoteControlModel } from './quote-control.model';

export interface QuoteModel extends QuoteControlModel {
  blackList: QuoteBlackList;
  client: QuoteClientModel;
  contactData: QuoteContactDataModel;
  driven: QuoteDrivenModel;
  insuranceCompany: QuoteInsuranceCompanyModel;
  offering: QuoteOfferingModel;
  personalData: QuotePersonalDataModel;
  place: QuotePlaceModel;
  vehicle: QuoteVehicleModel;
}

export namespace QuoteModel {
  export const init = (): QuoteModel => ({
    blackList: QuoteBlackList.init(),
    client: QuoteClientModel.init(),
    contactData: QuoteContactDataModel.init(),
    driven: QuoteDrivenModel.init(),
    insuranceCompany: QuoteInsuranceCompanyModel.init(),
    personalData: QuotePersonalDataModel.init(),
    place: QuotePlaceModel.init(),
    vehicle: QuoteVehicleModel.init(),
    offering: QuoteOfferingModel.init()
  });
}
