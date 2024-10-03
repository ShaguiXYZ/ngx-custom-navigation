/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
import { ClientModel } from './client.model';
import { ContactDataModel } from './contact-data.model';
import { DateOfIssueModel } from './dateOfIssue.model';
import { DrivenModel } from './driven.model';
import { InsuranceCompanyModel } from './insurance-company.model';
import { IOfferingModel } from './offering.model';
import { PersonalDataModel } from './personal-data.model';
import { PlaceModel } from './place.model';
import { IVehicleModel } from './vehicle.model';

export interface QuoteModel {
  client: ClientModel;
  contactData: ContactDataModel;
  dateOfIssue: DateOfIssueModel;
  driven: DrivenModel;
  insuranceCompany: InsuranceCompanyModel;
  offering: IOfferingModel;
  personalData: PersonalDataModel;
  place: PlaceModel;
  vehicle: IVehicleModel;
}

export namespace QuoteModel {
  export const init = (): QuoteModel => ({
    client: ClientModel.init(),
    contactData: ContactDataModel.init(),
    dateOfIssue: DateOfIssueModel.init(),
    driven: DrivenModel.init(),
    insuranceCompany: InsuranceCompanyModel.init(),
    personalData: PersonalDataModel.init(),
    place: PlaceModel.init(),
    vehicle: IVehicleModel.init(),
    offering: IOfferingModel.init()
  });
}
