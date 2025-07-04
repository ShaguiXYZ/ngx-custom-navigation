import { IndexedData } from '@shagui/ng-shagui/core';

interface VehicleSubmodelData {
  url: string;
  count: number;
  pages: number;
  total: number;
  next: string;
  prev: string;
  first: string;
  last: string;
}

interface Submodel {
  id: number;
  oem_make_model_id: number;
  year: number;
  make: string;
  model: string;
  submodel: string;
}

export interface VehicleSubmodelDTO {
  collection: VehicleSubmodelData;
  data: Submodel[];
}

export type ModelVersionModel = IndexedData<string, number>;
