/* eslint-disable @typescript-eslint/no-namespace */
import { deepCopy } from '@shagui/ng-shagui/core';
import CryptoJS from 'crypto-js';

export interface SignatureModel {
  changed?: boolean;
  hash?: string;
  budget?: string;
}

export interface SignedModel {
  signature?: SignatureModel;
}

export namespace SignedModel {
  export const reset = (signedModel: SignedModel): void => {
    signedModel.signature = { ...signedModel.signature, changed: false };
  };
  export const signModel = (model: SignedModel, ignoreChangeDetection = false): SignedModel => {
    const { signature, ...modelToSign } = deepCopy(model);
    const currentQuoteSignature = dataHash(modelToSign);

    return {
      ...modelToSign,
      signature: {
        hash: currentQuoteSignature,
        changed: !ignoreChangeDetection && (signature?.changed || signature?.hash !== currentQuoteSignature)
      }
    };
  };

  const dataHash = (model: SignedModel): string => CryptoJS.SHA256(JSON.stringify(model)).toString(CryptoJS.enc.Hex);
}
