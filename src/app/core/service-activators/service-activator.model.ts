import { ActivatorFnType, EntryPoint } from '.';
import { Condition } from '../models';

export interface ServiceActivator {
  entryPoint: EntryPoint;
  activator: ActivatorFnType;
  params?: unknown;
  conditions?: Condition[];
}
