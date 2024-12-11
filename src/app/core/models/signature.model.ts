/* eslint-disable @typescript-eslint/no-namespace */
import CryptoJS from 'crypto-js';
import { QuoteModel } from './quote.model';

export type QuoteSignificantData = Omit<QuoteModel, 'blackList' | 'contactData' | 'forms' | 'offering' | 'signature'>;

export namespace QuoteSignificantData {
  export const getSignificantData = (quote: QuoteModel): QuoteSignificantData => {
    const { blackList, contactData, forms, offering, signature, ...significantData } = quote;
    return significantData;
  };
}

export interface SignatureModel {
  changed?: boolean;
  hash?: string;
  budget?: string;
}

export const dataHash = (model: unknown): string => CryptoJS.SHA256(JSON.stringify(model)).toString(CryptoJS.enc.Hex);

export namespace SignatureModel {
  export const signModel = (model: QuoteModel, ignoreChangeDetection = false): SignatureModel => {
    const { signature } = model;
    const currentQuoteSignature = dataHash(QuoteSignificantData.getSignificantData(model));

    return {
      hash: currentQuoteSignature,
      changed: !ignoreChangeDetection && (signature?.changed || signature?.hash !== currentQuoteSignature)
    };
  };
}
