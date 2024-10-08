import { Injectable } from '@angular/core';
import { IndexedData } from '@shagui/ng-shagui/core';

const POSTAL_CODES = {
  ['01']: 'Araba/Álava',
  ['02']: 'Albacete',
  ['03']: 'Alicante',
  ['04']: 'Almería',
  ['05']: 'Ávila',
  ['06']: 'Badajoz',
  ['07']: 'Illes Balears',
  ['08']: 'Barcelona',
  ['09']: 'Burgos',
  ['10']: 'Cáceres',
  ['11']: 'Cádiz',
  ['12']: 'Castellón',
  ['13']: 'Ciudad Real',
  ['14']: 'Córdoba',
  ['15']: 'Coruña',
  ['16']: 'Cuenca',
  ['17']: 'Girona',
  ['18']: 'Granada',
  ['19']: 'Guadalajara',
  ['20']: 'Gipuzkoa',
  ['21']: 'Huelva',
  ['22']: 'Huesca',
  ['23']: 'Jaén',
  ['24']: 'León',
  ['25']: 'Lleida',
  ['26']: 'La Rioja',
  ['27']: 'Lugo',
  ['28']: 'Madrid',
  ['29']: 'Málaga',
  ['30']: 'Murcia',
  ['31']: 'Navarra',
  ['32']: 'Ourense',
  ['33']: 'Asturias',
  ['34']: 'Palencia',
  ['35']: 'Las Palmas',
  ['36']: 'Pontevedra',
  ['37']: 'Salamanca',
  ['38']: 'S.C. Tenerife',
  ['39']: 'Cantabria',
  ['40']: 'Segovia',
  ['41']: 'Sevilla',
  ['42']: 'Soria',
  ['43']: 'Tarragona',
  ['44']: 'Teruel',
  ['45']: 'Toledo',
  ['46']: 'Valencia',
  ['47']: 'Valladolid',
  ['48']: 'Bizkaia',
  ['49']: 'Zamora',
  ['50']: 'Zaragoza',
  ['51']: 'Ceuta',
  ['52']: 'Melilla'
};

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public getAddresses = (postalCode: string): Promise<IndexedData | undefined> => {
    if (postalCode.length !== 5) {
      return Promise.resolve(undefined);
    }

    const provinceCode = postalCode.substring(0, 2) as keyof typeof POSTAL_CODES;

    if (!POSTAL_CODES[provinceCode]) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve({ index: provinceCode, data: POSTAL_CODES[provinceCode] });
  };
}
