/* eslint-disable @typescript-eslint/no-namespace */
import CryptoJS from 'crypto-js';

export const dataHash = (model: unknown): string => CryptoJS.SHA256(JSON.stringify(model)).toString(CryptoJS.enc.Hex);

export interface SignatureModel {
  hash?: string;
  budget?: string;
}
