/* eslint-disable @typescript-eslint/no-namespace */
export interface LocationDTO {
  province: string;
  code: string;
  dc: number;
  location: string;
}

export interface LocationModel {
  location: string;
  postalCode: string;
  province: string;
}

export namespace LocationModel {
  export function create(postalCode: string, province: string, location: string): LocationModel {
    return { postalCode, province, location };
  }
}
