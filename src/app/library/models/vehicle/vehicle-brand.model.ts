interface BrandData {
  id: number;
  name: string;
}

export interface BrandDTO {
  collection: {
    url: string;
    count: number;
    pages: number;
    total: number;
    next: string;
    prev: string;
    first: string;
    last: string;
  };
  data: BrandData[];
}
