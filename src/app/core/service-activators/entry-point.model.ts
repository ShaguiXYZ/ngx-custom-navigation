import { ActivatorFnType, EntryPoints } from '.';
import { Condition } from '../models';

export interface EntryPoint {
  id: EntryPoints;
  activator: ActivatorFnType;
  params?: unknown;
  conditions?: Condition[];
}
