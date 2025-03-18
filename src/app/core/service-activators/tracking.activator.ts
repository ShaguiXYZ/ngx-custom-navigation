import { TrackEventType, TrackInfo } from '../tracking';
import { ActivatorFn, ActivatorServices, ServiceActivatorFn } from './quote-activator.model';

interface TrackActivatorModel {
  event: TrackEventType;
  data: TrackInfo;
}

export class TrackingActivator {
  public static trackEvent: ServiceActivatorFn<TrackActivatorModel, boolean> = ({
    trackService
  }: ActivatorServices): ActivatorFn<TrackActivatorModel, boolean> => {
    return (params?: TrackActivatorModel): boolean => {
      params && trackService && trackService.trackEvent(params.event, params.data);
      return true;
    };
  };
}
