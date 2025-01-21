interface BrandData {
  id: number;
  name: string;
}

export interface BrandDTO {
  info: {
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
