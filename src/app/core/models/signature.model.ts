/* eslint-disable @typescript-eslint/no-namespace */
import { deepCopy } from '@shagui/ng-shagui/core';
import CryptoJS from 'crypto-js';
import { QuoteControlModel } from './quote-control.model';

export interface SignatureModel {
  changed?: boolean;
  hash?: string;
  budget?: string;
}

export namespace SignatureModel {
  export const signModel = (model: QuoteControlModel, ignoreChangeDetection = false): QuoteControlModel => {
    const copy = deepCopy(model);
    const { signature, forms, ...modelToSign } = copy;
    const currentQuoteSignature = dataHash(modelToSign);
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
