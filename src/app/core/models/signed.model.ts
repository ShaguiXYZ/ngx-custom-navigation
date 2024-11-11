/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import CryptoJS from 'crypto-js';

export interface SignedModel {
  changed?: boolean;
  signature?: string;
}

export namespace SignedModel {
  export const init = (signedModel: SignedModel): void => {
    signedModel.changed = false;
  };
  export const signModel = (signedModel: SignedModel, ignoreChangeDetection = false): void => {
    const { signature, changed, ...modelToSign } = signedModel;
    const currentQuoteSignature = dataHash(modelToSign);

    if (signedModel.signature !== currentQuoteSignature) {
      signedModel.signature = currentQuoteSignature;

      if (!ignoreChangeDetection) {
        signedModel.changed = true;
      }
    }
  };

  const dataHash = (signedModel: SignedModel): string => CryptoJS.SHA256(JSON.stringify(signedModel)).toString(CryptoJS.enc.Hex);
}
