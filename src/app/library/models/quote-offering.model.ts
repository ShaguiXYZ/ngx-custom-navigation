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
  premium?: string;
  paymentTypeDescription: string;
  contractable: string;
  totalPremiumAmount: string;
  fee: string | string[];
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
  operationId: string;
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

export namespace OfferingDTO {
  export const toModel = (dto: OfferingDTO): QuoteOfferingModel => {
    const prices: OfferingPriceModel[] = dto.operationData.priceGrid.map(priceGrid => {
      const mapCoverage = (coverageDTO: CoverageDTO): Coverage => ({
        code: coverageDTO.code,
        text: coverageDTO.texto,
        description: coverageDTO.description,
        isContracted: coverageDTO.isContracted,
        value: coverageDTO.value,
        subcoverages: Array.isArray(coverageDTO.subcoverages) ? (coverageDTO.subcoverages as CoverageDTO[]).map(mapCoverage) : null
      });

      const roundToNDecimals = (value: string, n: number): number => parseFloat(parseFloat(value).toFixed(n));

      return {
        modalityId: priceGrid.modalityId,
        modalityDescription: priceGrid.modalityDescription,
        modalityFullDescription: priceGrid.modalityFullDescription,
        paymentType: priceGrid.paymentType,
        paymentTypeDescription: priceGrid.paymentTypeDescription,
        contractable: priceGrid.contractable,
        totalPremiumAmount: roundToNDecimals(priceGrid.totalPremiumAmount, 2),
        popular: priceGrid.premium ? priceGrid.premium === '1' : false,
        fee: priceGrid.fee
          ? typeof priceGrid.fee === 'string'
            ? [roundToNDecimals(priceGrid.fee, 2)]
            : priceGrid.fee.splice(0, 2).map(value => roundToNDecimals(value, 2))
          : [],
        receiptData: {
          firstReceiptAmount: roundToNDecimals(priceGrid.receiptData.firstReceiptAmount, 2),
          followingReceiptAmount: roundToNDecimals(priceGrid.receiptData.followingReceiptAmount, 2)
        },
        coverageList: priceGrid.coverageList.map(mapCoverage),
        configurableCoverageList: priceGrid.configurableCoverageList.map(mapCoverage)
      };
    });

    return { quotationId: dto.operationData.quotationId, prices: prices }; // Assuming you want to return the first price object
  };
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
  totalPremiumAmount: number;
  fee: number[];
  feeSelectedIndex?: number;
  receiptData: ReceiptData;
  coverageList: Coverage[];
  configurableCoverageList: Coverage[];
}

export interface QuoteOfferingModel {
  quotationId?: number;
  price?: OfferingPriceModel;
  prices?: OfferingPriceModel[];
  hash?: string;
}

export namespace QuoteOfferingModel {
  export const init = (): QuoteOfferingModel => ({} as QuoteOfferingModel);
}
