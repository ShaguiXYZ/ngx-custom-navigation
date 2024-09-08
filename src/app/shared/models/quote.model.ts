/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
import { IVehicleModel } from '../components/vehicle-selection/models/vehicle.model';
import { ClientModel } from './client.model';
import { DateOfIssueModel } from './dateOfIssue.model';
import { DrivenModel } from './driven.model';
import { InsuranceCompanyModel } from './insurance-company.model';
import { IOfferingModel } from './offering.model';
import { PersonalDataModel } from './personal-data.model';
import { PlaceModel } from './place.model';

export interface QuoteModel {
  client: ClientModel;
  driven: DrivenModel;
  personalData: PersonalDataModel;
  place: PlaceModel;
  vehicle: IVehicleModel;
  dateOfIssue: DateOfIssueModel;
  insuranceCompany: InsuranceCompanyModel;
  offering: IOfferingModel;
}

export namespace QuoteModel {
  export const init = (): QuoteModel => ({
    client: ClientModel.init(),
    driven: DrivenModel.init(),
    personalData: PersonalDataModel.init(),
    place: PlaceModel.init(),
    vehicle: IVehicleModel.init(),
    dateOfIssue: DateOfIssueModel.init(),
    insuranceCompany: InsuranceCompanyModel.init(),
    offering: IOfferingModel.init()
  });
}
