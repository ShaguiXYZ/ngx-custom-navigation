import { inject, Injectable } from '@angular/core';
import { DataInfo, HttpService, HttpStatus } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { LocationDTO, LocationModel } from '../models';

const POSTAL_CODES: DataInfo = {
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
  private readonly locationUri = './assets/json/mock';

  private readonly httpService = inject(HttpService);

  public getAddresses = async (postalCode: string): Promise<LocationModel | undefined> => {
    if (!/^\d{5}$/.test(postalCode)) {
      return undefined;
    }

    const provinceCode = postalCode.substring(0, 2) as keyof typeof POSTAL_CODES;

    if (!POSTAL_CODES[provinceCode]) {
      return undefined;
    }

    const locationCode = postalCode.substring(2);

    const locations = await firstValueFrom(
      this.httpService
        .get<LocationDTO[]>(`${this.locationUri}/locations.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => res as LocationDTO[]))
    );

    const location = locations.find(data => data.province === provinceCode && data.code === locationCode);

    return location
      ? LocationModel.create(`${location.province}${location.code}`, POSTAL_CODES[location.province], location.location)
      : undefined;
  };
}
