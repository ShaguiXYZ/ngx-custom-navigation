export const TRACKING_QUOTE_MANIFEST = {
  accidents: 'client.accidents',
  dateOfIssue: 'client.dateOfIssue',
  expiration: 'client.expiration',
  isClient: 'client.isClient',
  isPolicyOwner: 'client.isPolicyOwner',
  contactHour: 'contactData.contactHour',
  drivenLicenseCountry: 'driven.licenseCountry',
  drivenLicenseDate: 'driven.licenseDate',
  insuranceCompany: 'insuranceCompany.company',
  yearsAsOwner: 'insuranceCompany.yearsAsOwner',
  birthdate: 'personalData.birthdate',
  email: 'personalData.email',
  identificationNumber: 'personalData.identificationNumber',
  name: 'personalData.name',
  surname: 'personalData.surname',
  phoneNumber: 'personalData.phoneNumber',
  location: 'place.postalCode',
  cubicCapacity: 'vehicle.cubicCapacity.index',
  fuel: 'vehicle.fuel.index',
  make: 'vehicle.make',
  model: 'vehicle.model',
  plateNumber: 'vehicle.plateNumber',
  powerRange: 'vehicle.powerRange.index',
  vehicleType: 'vehicle.vehicleType',
  yearOfManufacture: 'vehicle.yearOfManufacture'
};

export type TrackEventType = 'click' | 'keydown' | 'keyup' | 'focus' | 'blur' | 'change' | 'input' | 'submit';
export type TrackKey =
  | 'action'
  | 'brand'
  | 'category'
  | 'client'
  | 'company'
  | 'cubicCapacity'
  | 'displayment'
  | 'event'
  | 'fuel'
  | 'infoPag'
  | 'insurance'
  | 'label'
  | 'location'
  | 'model'
  | 'modelVersion'
  | 'new'
  | 'pagina'
  | 'power'
  | 'selectedAccidents'
  | 'selected_tab'
  | 'step_number'
  | 'title'
  | 'typologyfranquicia'
  | 'yearsAsOwner'
  | 'yearOfManufacture'
  | 'URL'
  | keyof typeof TRACKING_QUOTE_MANIFEST;
export type TrackInfo = Record<TrackKey, string | null | undefined>;

export const quoteTrackInfo = {
  category: 'car quote',
  action: 'onboarding',
  label: 'onboarding',
  title: 'Onboarding',
  client: 'Allianz',
  location: 'Spain',
  new: 'new',
  brand: 'brand'
};

export interface TrackInfoPageModel {
  pagina: string;
  URL: string;
  pagina_previa?: string;
  tipo_usuario: string;
  tipo_dispositivo: string;
}
