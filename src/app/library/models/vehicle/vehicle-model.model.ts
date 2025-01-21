interface VehicleModelData {
  url: string;
  count: number;
  pages: number;
  total: number;
  next: string;
  prev: string;
  first: string;
  last: string;
}

interface Model {
  id: number;
  make_id: number;
  name: string;
}

export interface VehicleModelDTO {
  collection: VehicleModelData;
  data: Model[];
}
