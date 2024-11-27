export const TRACKING_QUOTE_MANIFEST = {
  accidents: 'client.accidents',
  dateOfIssue: 'client.dateOfIssue',
  expiration: 'client.expiration',
  client: 'client.isClient',
  insurance: 'client.isPolicyOwner',
  isCurrentlyInsured: 'client.isCurrentlyInsured',
  contactHour: 'contactData.contactHour',
  location: 'driven.licenseCountry',
  drivenLicenseDate: 'driven.licenseDate',
  company: 'insuranceCompany.company.index',
  yearsAsOwner: 'insuranceCompany.yearsAsOwner',
  birthdate: 'personalData.birthdate',
  email: 'personalData.email',
  identificationNumber: 'personalData.identificationNumber',
  name: 'personalData.name',
  surname: 'personalData.surname',
  phoneNumber: 'personalData.phoneNumber',
  postalCode: 'place.postalCode',
  brand: 'vehicle.make',
  displayment: 'vehicle.cubicCapacity.index',
  fuel: 'vehicle.fuel.index',
  model: 'vehicle.model',
  modelVersion: 'vehicle.modelVersion.index',
  plateNumber: 'vehicle.plateNumber',
  power: 'vehicle.powerRange.index',
  vehicleType: 'vehicle.vehicleType',
  yearOfManufacture: 'vehicle.yearOfManufacture'
};

export type TrackEventType = 'click' | 'keydown' | 'keyup' | 'focus' | 'blur' | 'change' | 'input' | 'submit';
export type TrackKey =
  | 'action'
  | 'category'
  | 'event'
  | 'infoPag'
  | 'label'
  | 'new'
  | 'pagina'
  | 'selected_tab'
  | 'step_number'
  | 'title'
  | 'typologyfranquicia'
  | 'URL'
  | keyof typeof TRACKING_QUOTE_MANIFEST;
export type TrackInfo = Partial<Record<TrackKey, string | number | boolean | null | undefined>>;

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
  page: string;
  URL: string;
  referrer?: string;
  user_type: string;
  device_type: string;
}
