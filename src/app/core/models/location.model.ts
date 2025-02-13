/* eslint-disable @typescript-eslint/no-namespace */
export interface LocationDTO {
  location: string;
  code: string;
  dc: number;
  province: string;
}

export interface LocationModel {
  location: string;
  postalCode: string;
  province: string;
  provinceCode: string;
}

export namespace LocationModel {
  export function create(postalCode: string, province: string, location: string): LocationModel {
    return { postalCode, province, provinceCode: postalCode.substring(0, 2), location };
  }
}
