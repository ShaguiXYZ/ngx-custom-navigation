/* eslint-disable @typescript-eslint/no-namespace */
import CryptoJS from 'crypto-js';

export interface SignatureModel {
  changed?: boolean;
  hash?: string;
}

export interface SignedModel {
  signature?: SignatureModel;
}

export namespace SignedModel {
  export const init = (signedModel: SignedModel): void => {
    signedModel.signature = { ...signedModel.signature, changed: false };
  };
  export const signModel = (signedModel: SignedModel, ignoreChangeDetection = false): void => {
    const { signature, ...modelToSign } = signedModel;
    const currentQuoteSignature = dataHash(modelToSign);

    if (signedModel.signature?.hash !== currentQuoteSignature) {
      const hash = currentQuoteSignature;
      const changed = !ignoreChangeDetection || signature?.changed;

      signedModel.signature = { hash, changed };
    }
  };

  const dataHash = (signedModel: SignedModel): string => CryptoJS.SHA256(JSON.stringify(signedModel)).toString(CryptoJS.enc.Hex);
}
