export interface TrackedData {
  value: string;
  tracked: boolean;
}

export const TRACKING_QUOTE_MANIFEST: Record<string, TrackedData> = {
  accidents: { value: 'client.accidents', tracked: false },
  dateOfIssue: { value: 'client.dateOfIssue', tracked: false },
  expiration: { value: 'client.expiration', tracked: false },
  client: { value: 'client.isClient', tracked: true },
  insurance: { value: 'client.isPolicyOwner', tracked: true },
  isCurrentlyInsured: { value: 'client.isCurrentlyInsured', tracked: false },
  contactHour: { value: 'contactData.contactHour', tracked: false },
  location: { value: 'driven.licenseCountry', tracked: true },
  drivenLicenseDate: { value: 'driven.licenseDate', tracked: false },
  company: { value: 'insuranceCompany.company.index', tracked: true },
  yearsAsOwner: { value: 'insuranceCompany.yearsAsOwner', tracked: false },
  birthdate: { value: 'personalData.birthdate', tracked: false },
  email: { value: 'personalData.email', tracked: false },
  identificationNumber: { value: 'personalData.identificationNumber', tracked: false },
  name: { value: 'personalData.name', tracked: false },
  surname: { value: 'personalData.surname', tracked: false },
  phoneNumber: { value: 'personalData.phoneNumber', tracked: false },
  postalCode: { value: 'place.postalCode', tracked: false },
  brand: { value: 'vehicle.brand', tracked: true },
  displayment: { value: 'vehicle.cubicCapacity.index', tracked: true },
  fuel: { value: 'vehicle.fuel.index', tracked: true },
  model: { value: 'vehicle.model', tracked: true },
  modelVersion: { value: 'vehicle.modelVersion.index', tracked: false },
  plateNumber: { value: 'vehicle.plateNumber', tracked: false },
  power: { value: 'vehicle.powerRange.index', tracked: false },
  new: { value: 'vehicle.vehicleType', tracked: true },
  yearOfManufacture: { value: 'vehicle.yearOfManufacture', tracked: false }
};

export type TrackEventType = 'click' | 'keydown' | 'keyup' | 'focus' | 'blur' | 'change' | 'input' | 'submit';
export type TrackKey =
  | 'action'
  | 'category'
  | 'event'
  | 'infoPag'
  | 'label'
  | 'new'
  | 'page'
  | 'selected_tab'
  | 'step_number'
  | 'title'
  | 'typology'
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
