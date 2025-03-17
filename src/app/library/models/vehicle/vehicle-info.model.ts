/* eslint-disable @typescript-eslint/no-namespace */
import { QuoteVehicleModel } from '../quote-vehicle.model';

interface VehicleCollection {
  url: string;
  count: number;
  pages: number;
  total: number;
  next: string;
  prev: string;
  first: string;
  last: string;
}

interface VehicleData {
  id: number;
  make_model_id: number;
  year: number;
  name: string;
  description: string;
  msrp: number;
  invoice: number;
  created: string;
  modified: string;
  __message?: string;
}

export interface VehicleInfoDTO {
  collection: VehicleCollection;
  data: VehicleData[];
}

export namespace VehicleInfoDTO {
  export const toModel = (dto: VehicleInfoDTO): QuoteVehicleModel[] => {
    return dto.data.map(data => ({
      id: data.id,
      makeModelId: data.make_model_id,
      yearOfManufacture: data.year,
      name: data.name,
      description: data.description,
      msrp: data.msrp,
      invoice: data.invoice,
      creationDate: new Date(data.created),
      modified: new Date(data.modified),
      notFound: !!data.__message
    }));
  };
}
