import CryptoJS from 'crypto-js';

export class BudgetUtils {
  public static encrypt = <T = unknown>(passKey: string, data: T): string => CryptoJS.AES.encrypt(JSON.stringify(data), passKey).toString();

  public static decrypt = <T = unknown>(passKey: string, encryptedContext: string): T => {
    const bytes = CryptoJS.AES.decrypt(encryptedContext, passKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedString) as T;
  };
}
