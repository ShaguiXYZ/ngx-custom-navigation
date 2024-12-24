import { FormValidations } from '../form';
import { SignatureModel } from './signature.model';

export interface QuoteControlModel {
  forms?: Record<string, FormValidations>;
  signature?: SignatureModel;
}
