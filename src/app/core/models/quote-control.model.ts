import { FormValidations } from '../form';
import { SignatureModel } from './signature.model';

export interface QuoteControlModel {
  forms?: { [page: string]: FormValidations };
  signature?: SignatureModel;
}
