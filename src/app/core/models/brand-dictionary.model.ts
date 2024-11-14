import { DataInfo } from '@shagui/ng-shagui/core';
import { IIconData } from './icon-data.model';

export type BrandKey = keyof typeof brandDictionary;

export type IconDictionary = DataInfo<Partial<IIconData> & { icon: string }>;

export const brandDictionary: IconDictionary = {
  MINI: { icon: 'assets/images/wm/insurances/car/brands/desktop/027.fw.png' },
  VOLVO: { icon: 'assets/images/wm/insurances/car/brands/desktop/026.fw.png' },
  SMART: { icon: 'assets/images/wm/insurances/car/brands/desktop/025.fw.png' },
  MAZDA: { icon: 'assets/images/wm/insurances/car/brands/desktop/024.fw.png' },
  SUZUKI: { icon: 'assets/images/wm/insurances/car/brands/desktop/023.fw.png' },
  MITSUBISHI: { icon: 'assets/images/wm/insurances/car/brands/desktop/022.fw.png' },
  LAND_ROVER: { icon: 'assets/images/wm/insurances/car/brands/desktop/021.fw.png' },
  TOYOTA: { icon: 'assets/images/wm/insurances/car/brands/desktop/020.fw.png' },
  HONDA: { icon: 'assets/images/wm/insurances/car/brands/desktop/019.fw.png' },
  RENAULT: { icon: 'assets/images/wm/insurances/car/brands/desktop/018.fw.png' },
  HYUNDAI: { icon: 'assets/images/wm/insurances/car/brands/desktop/017.fw.png' },
  KIA: { icon: 'assets/images/wm/insurances/car/brands/desktop/016.fw.png' },
  SEAT: { icon: 'assets/images/wm/insurances/car/brands/desktop/015.fw.png' },
  SKODA: { icon: 'assets/images/wm/insurances/car/brands/desktop/014.fw.png' },
  MERCEDES: { icon: 'assets/images/wm/insurances/car/brands/desktop/013.fw.png' },
  NISSAN: { icon: 'assets/images/wm/insurances/car/brands/desktop/012.fw.png' },
  DACIA: { icon: 'assets/images/wm/insurances/car/brands/desktop/011.fw.png' },
  LEXUS: { icon: 'assets/images/wm/insurances/car/brands/desktop/010.fw.png' },
  OPEL: { icon: 'assets/images/wm/insurances/car/brands/desktop/009.fw.png' },
  PEUGEOT: { icon: 'assets/images/wm/insurances/car/brands/desktop/008.fw.png' },
  VOLKSWAGEN: { icon: 'assets/images/wm/insurances/car/brands/desktop/007.fw.png' },
  FORD: { icon: 'assets/images/wm/insurances/car/brands/desktop/006.fw.png' },
  FIAT: { icon: 'assets/images/wm/insurances/car/brands/desktop/005.fw.png' },
  CITROEN: { icon: 'assets/images/wm/insurances/car/brands/desktop/004.fw.png' },
  CHEVROLET: { icon: 'assets/images/wm/insurances/car/brands/desktop/003.fw.png' },
  BMW: { icon: 'assets/images/wm/insurances/car/brands/desktop/002.fw.png' },
  AUDI: { icon: 'assets/images/wm/insurances/car/brands/desktop/001.fw.png' }
};
