/* eslint-disable @typescript-eslint/no-namespace */
import { deepCopy } from '@shagui/ng-shagui/core';
import CryptoJS from 'crypto-js';
import { QuoteControlModel } from './quote-control.model';
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

export namespace SignatureModel {
  export const signModel = (model: QuoteModel, ignoreChangeDetection = false): QuoteControlModel => {
    const copy = deepCopy(model);
    const { signature } = copy;
    const currentQuoteSignature = dataHash(QuoteSignificantData.getSignificantData(copy));
    const signModel = {
      hash: currentQuoteSignature,
      changed: !ignoreChangeDetection && (signature?.changed || signature?.hash !== currentQuoteSignature)
    };

    return {
      ...copy,
      signature: signModel
    };
  };

  const dataHash = (model: unknown): string => CryptoJS.SHA256(JSON.stringify(model)).toString(CryptoJS.enc.Hex);
}
