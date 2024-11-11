/* eslint-disable @typescript-eslint/no-namespace */
export interface ReceiptDataDTO {
  firstReceiptAmount: string;
  followingReceiptAmount: string;
}

export interface CoverageDTO {
  code: number;
  texto: string;
  description: string;
  isContracted: string;
  value: string;
  subcoverages: unknown;
}

export interface PriceGridDTO {
  modalityId: number;
  modalityDescription: string;
  modalityFullDescription?: string;
  paymentType: string;
  paymentTypeDescription: string;
  contractable: string;
  totalPremiumAmount: string;
  fee: string;
  newPremium: unknown;
  receiptData: ReceiptDataDTO;
  coverageList: CoverageDTO[];
  configurableCoverageList: CoverageDTO[];
  blockageList: unknown[];
}

export interface PolicyDatesDTO {
  policyEffectiveDate: string;
  policyExpirationDate: string;
}

export interface CapDiscountDTO {
  max: unknown;
  value: unknown;
  maxValue: string;
  appliedValue: string;
}

export interface TransferDiscountDTO {
  max: unknown;
  value: unknown;
  maxValue: string;
  appliedValue: string;
}

export interface AdjustmentsResultDTO {
  comissionType: unknown;
  capDiscount: CapDiscountDTO;
  transferDiscount: TransferDiscountDTO;
  crossSellingDiscount: unknown;
  antecedentsLevel: string;
  levelApplied: string;
  capSurchargeDiscount: unknown;
  maxSurcharge: string;
}

export interface ReceiptDTO {
  receiptNumber: unknown;
  receiptsDates: unknown;
  amounts: unknown;
  firstReceiptType: number;
  followingReceiptType: number;
  paymentFrequency: string;
}

export interface OperationDataDTO {
  allianzOperationId: string;
  policyDates: PolicyDatesDTO;
  quotationId: number;
  policyDTO: unknown;
  priceGrid: PriceGridDTO[];
  receipt: ReceiptDTO;
  discounts: unknown;
  segmentRisk: number;
  status: unknown;
  agentHasAuthorization: unknown;
  accidentRatePercentage: unknown;
  listAddons: unknown[];
  tireaCodeData: unknown;
  adjustmentsResult: AdjustmentsResultDTO;
  bundleIdSuggested: unknown;
  bnsCode: unknown;
}

export interface OfferingDTO {
  operationData: OperationDataDTO;
  operationWarningList: unknown[];
  operationErrorList: unknown[];
  legalInformation: unknown;
  agentCluster: number;
}

export interface ReceiptData {
  firstReceiptAmount: number;
  followingReceiptAmount: number;
}

export interface Coverage {
  code: number;
  text: string;
  description: string;
  isContracted: string;
  value: string | number;
  options?: (string | number)[];
  subcoverages: Coverage[] | null;
}

export interface OfferingPriceModel {
  modalityId: number;
  modalityDescription: string;
  modalityFullDescription?: string;
  paymentType: string;
  paymentTypeDescription: string;
  popular?: boolean;
  contractable: string;
  totalPremiumAmount: string;
  fee: string[];
  feeSelectedIndex?: number;
  receiptData: ReceiptData;
  coverageList: Coverage[];
  configurableCoverageList: Coverage[];
}

export interface QuoteOfferingModel {
  quotationId: number;
  price?: OfferingPriceModel;
  prices: OfferingPriceModel[];
}

export namespace QuoteOfferingModel {
  export const init = (): QuoteOfferingModel => ({} as QuoteOfferingModel);
  export const fromDTO = (dto: OfferingDTO): QuoteOfferingModel => {
    const prices: OfferingPriceModel[] = dto.operationData.priceGrid.map(priceGrid => {
      const mapCoverage = (coverageDTO: CoverageDTO): Coverage => ({
        code: coverageDTO.code,
        text: coverageDTO.texto,
        description: coverageDTO.description,
        isContracted: coverageDTO.isContracted,
        value: coverageDTO.value,
        subcoverages: Array.isArray(coverageDTO.subcoverages) ? (coverageDTO.subcoverages as CoverageDTO[]).map(mapCoverage) : null
      });

      return {
        modalityId: priceGrid.modalityId,
        modalityDescription: priceGrid.modalityDescription,
        modalityFullDescription: priceGrid.modalityFullDescription,
        paymentType: priceGrid.paymentType,
        paymentTypeDescription: priceGrid.paymentTypeDescription,
        contractable: priceGrid.contractable,
        totalPremiumAmount: priceGrid.totalPremiumAmount,
        fee: priceGrid.fee ? [priceGrid.fee] : [],
        receiptData: {
          firstReceiptAmount: parseFloat(priceGrid.receiptData.firstReceiptAmount),
          followingReceiptAmount: parseFloat(priceGrid.receiptData.followingReceiptAmount)
        },
        coverageList: priceGrid.coverageList.map(mapCoverage),
        configurableCoverageList: priceGrid.configurableCoverageList.map(mapCoverage)
      };
    });

    return { quotationId: dto.operationData.quotationId, prices: prices }; // Assuming you want to return the first price object
  };
}
