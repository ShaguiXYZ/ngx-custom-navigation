/* eslint-disable @typescript-eslint/no-namespace */
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../constants';
import { QuoteModel } from './quote.model';

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
  operationAllianzId?: number;
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
  export const fromModel = (model: QuoteModel): PricingDTO => ({
    authentication: {
      company: 'CIA',
      channel: 'CHANEL',
      partnerId: 'PARTNER',
      agentId: 'AGENT',
      agentCode: 0,
      agentHelperCode: 0,
      office: 0,
      groupings: [0]
    },
    operationHeaders: { operationTypeCode: '', productCode: 0, operationAllianzId: 0, operative: 0, profile: '' },
    operationDataT1: {
      generalData: {
        policyDates: {
          policyEffectiveDate: model.client.dateOfIssue && moment(model.client.dateOfIssue).format(DEFAULT_DATE_FORMAT),
          policyExpirationDate: model.client.expiration && moment(model.client.expiration).format(DEFAULT_DATE_FORMAT)
        },
        receipts: { firstReceiptType: 1, followingReceiptType: 1, paymentFrequency: 'A' },
        discounts: {
          backgroundLevel: { max: 0, value: 0 },
          cap: { max: 0, value: 0 },
          capSurcharge: { max: 50, value: 0 },
          commissionReduction: { max: 'A', value: 'A' },
          centralAdjustment: { max: 999, value: 0 },
          transfer: { max: 0, value: 0 },
          employee: { max: 0, value: 0 },
          crossSale: { max: 0, value: 0 },
          campaigns: { max: 0, value: 0 }
        }
      },
      participantsData: {
        holder: {
          document: { documentType: 'N', documentNumber: model.personalData.identificationNumber },
          address: { city: model.place.location, postalCode: model.place.postalCode },
          birthDate: model.personalData.birthdate && moment(model.personalData.birthdate).format(DEFAULT_DATE_FORMAT),
          licenseDate: model.driven.licenseDate && moment(model.driven.licenseDate).format(DEFAULT_DATE_FORMAT)
        },
        owner: {
          document: { documentType: 'N', documentNumber: model.personalData.identificationNumber },
          address: { city: model.place.location, postalCode: model.place.postalCode },
          birthDate: model.personalData.birthdate && moment(model.personalData.birthdate).format(DEFAULT_DATE_FORMAT),
          licenseDate: model.driven.licenseDate && moment(model.driven.licenseDate).format(DEFAULT_DATE_FORMAT)
        },
        driver: null,
        secondDriver: null,
        nominatedDriver: true,
        nominatedSecondDriver: false
      },
      riskData: {
        postalCode: model.place.postalCode,
        city: model.place.location,
        province: model.place.provinceCode,
        vehicleInfo: {
          plateNumber: model.vehicle.plateNumber?.toUpperCase() ?? '',
          vehicleTrademark: model.vehicle.make,
          vehicleModel: model.vehicle.model,
          vehicleCode: model.vehicle.modelVersion?.index,
          vehicleClass: '',
          vehicleVersion: model.vehicle.modelVersion?.index,
          creationDate: model.vehicle.creationDate && moment(model.vehicle.creationDate).format(DEFAULT_DATE_FORMAT),
          vehicleBaseCode: model.vehicle.base7
        }
      },
      previousCompanyData: {
        companyCode: model.insuranceCompany.company?.index,
        previousPolicyLast5: '',
        licensePlate: model.vehicle.plateNumber
      }
    }
  });
}
