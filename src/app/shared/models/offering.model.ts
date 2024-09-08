export interface ReceiptData {
  firstReceiptAmount: number;
  followingReceiptAmount: number;
}

export interface Coverage {
  code: number;
  texto: string;
  description: string;
  isContracted: string;
  value: string | number;
  options?: (string | number)[];
  subcoverages: Coverage[] | null;
}

export interface OfferingPriceModel {
  modalityId: number;
  modalityDescription: string;
  modalityFullDescription: string | null;
  paymentType: string;
  paymentTypeDescription: string;
  popular?: boolean;
  contractable: string;
  totalPremiumAmount: string;
  fee: string;
  receiptData: ReceiptData;
  coverageList: Coverage[];
  configurableCoverageList: Coverage[];
}

export interface IOfferingModel {
  price: OfferingPriceModel;
}

export namespace IOfferingModel {
  export const init = (): IOfferingModel => ({} as IOfferingModel);
}
