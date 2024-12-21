/* eslint-disable @typescript-eslint/no-namespace */
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../constants';
import { QuoteModel } from './_quote.model';
import { patch } from '../lib';

export interface Authentication {
  company?: string;
  channel?: string;
  partnerId?: string;
  agentId?: string;
  agentCode?: number;
  agentHelperCode?: number;
  office?: number;
  groupings?: number[];
}

export interface OperationHeaders {
  operationTypeCode?: string;
  productCode?: number;
  operationId?: number;
  operative?: number;
  profile?: string;
}

export interface PolicyDates {
  policyEffectiveDate?: string;
  policyExpirationDate?: string;
}

export interface Receipts {
  firstReceiptType?: number;
  followingReceiptType?: number;
  paymentFrequency?: string;
}

export interface Discount {
  max?: number | string;
  value?: number | string;
}

export interface Discounts {
  backgroundLevel?: Discount;
  cap?: Discount;
  capSurcharge?: Discount;
  commissionReduction?: Discount;
  centralAdjustment?: Discount;
  transfer?: Discount;
  employee?: Discount;
  crossSale?: Discount;
  campaigns?: Discount;
}

export interface GeneralData {
  policyDates?: PolicyDates;
  receipts?: Receipts;
  discounts?: Discounts;
}

export interface Document {
  documentType?: string;
  documentNumber?: string;
}

export interface Address {
  city?: string;
  postalCode?: string;
}

export interface Participant {
  document?: Document;
  address?: Address;
  birthDate?: string;
  licenseDate?: string;
}

export interface ParticipantsData {
  holder?: Participant;
  owner?: Participant;
  driver?: Participant | null;
  secondDriver?: Participant | null;
  nominatedDriver?: boolean;
  nominatedSecondDriver?: boolean;
}

export interface VehicleInfo {
  plateNumber?: string;
  vehicleTrademark?: string;
  vehicleModel?: string;
  vehicleCode?: number;
  vehicleClass?: string;
  vehicleVersion?: number;
  creationDate?: string;
  vehicleBaseCode?: number;
}

export interface RiskData {
  postalCode?: string;
  city?: string;
  province?: string;
  vehicleInfo?: VehicleInfo;
}

export interface PreviousCompanyData {
  companyCode?: string;
  previousPolicyLast5?: string;
  licensePlate?: string;
}

export interface OperationDataT1 {
  generalData?: GeneralData;
  participantsData?: ParticipantsData;
  riskData?: RiskData;
  previousCompanyData?: PreviousCompanyData;
}

export interface PricingDTO {
  authentication?: Authentication;
  operationHeaders?: OperationHeaders;
  operationDataT1?: OperationDataT1;
}

export namespace PricingDTO {
  export const fromModel = (model: QuoteModel, settings: Partial<PricingDTO>): PricingDTO => {
    const value = {
      operationDataT1: {
        generalData: {
          policyDates: {
            policyEffectiveDate: model.client.dateOfIssue && moment(model.client.dateOfIssue).format(DEFAULT_DATE_FORMAT),
            policyExpirationDate: model.client.expiration && moment(model.client.expiration).format(DEFAULT_DATE_FORMAT)
          }
        },
        participantsData: {
          holder: {
            document: { documentNumber: model.personalData.identificationNumber },
            address: { city: model.place.location, postalCode: model.place.postalCode },
            birthDate: model.personalData.birthdate && moment(model.personalData.birthdate).format(DEFAULT_DATE_FORMAT),
            licenseDate: model.driven.licenseDate && moment(model.driven.licenseDate).format(DEFAULT_DATE_FORMAT)
          },
          owner: {
            document: { documentNumber: model.personalData.identificationNumber },
            address: { city: model.place.location, postalCode: model.place.postalCode },
            birthDate: model.personalData.birthdate && moment(model.personalData.birthdate).format(DEFAULT_DATE_FORMAT),
            licenseDate: model.driven.licenseDate && moment(model.driven.licenseDate).format(DEFAULT_DATE_FORMAT)
          }
        },
        riskData: {
          postalCode: model.place.postalCode,
          city: model.place.location,
          province: model.place.provinceCode,
          vehicleInfo: {
            plateNumber: model.vehicle.plateNumber?.toUpperCase() ?? '',
            vehicleTrademark: model.vehicle.brand,
            vehicleModel: model.vehicle.model,
            vehicleCode: model.vehicle.modelVersion?.index,
            vehicleVersion: model.vehicle.modelVersion?.index,
            creationDate: model.vehicle.creationDate && moment(model.vehicle.creationDate).format(DEFAULT_DATE_FORMAT),
            vehicleBaseCode: model.vehicle.base7
          }
        },
        previousCompanyData: {
          companyCode: model.insuranceCompany.company?.index,
          licensePlate: model.vehicle.plateNumber
        }
      }
    };

    return patch<PricingDTO>(value, settings);
  };
}
