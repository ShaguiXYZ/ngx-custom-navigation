import { EntryPoint, ServiceActivatorType } from '.';
import { Condition } from '../models';

export interface ServiceActivator {
  entryPoint: EntryPoint;
  activator: ServiceActivatorType;
  params?: unknown;
  conditions?: Condition[];
}
