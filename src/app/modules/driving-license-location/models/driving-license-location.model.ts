import { IIconData } from 'src/app/shared/models';

const iconPath = 'assets/images/wm/driving-license/location';

export const DrivingLicenseIcons: IIconData[] = [
  {
    index: 'eu',
    icon: `${iconPath}/europe.png`,
    data: 'Europa'
  },
  {
    index: 'uk',
    icon: `${iconPath}/uk.png`,
    data: 'Reino Unido'
  },
  {
    index: 'other',
    icon: `${iconPath}/world.png`,
    data: 'Otros'
  }
];
