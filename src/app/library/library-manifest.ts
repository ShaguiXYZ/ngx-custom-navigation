import { InjectionToken } from '@angular/core';
import { QuoteComponent } from '../core/components';
import { QuoteWorkflowSettings } from '../core/components/models';
import { ActivatorFn, ActivatorServices, ServiceActivatorType } from '../core/service-activators';
import { TrackManifest } from '../core/tracking';
import {
  BirthdateComponent,
  DateOfIssueComponent,
  DrivingLicenseDateComponent,
  DrivingLicenseLocationComponent,
  IsClientComponent,
  PlaceComponent
} from './components/client-components';
import {
  ApologyComponent,
  ConfirmationComponent,
  ContactTimeComponent,
  ContactUsComponent,
  OnBoardingComponent
} from './components/common-components';
import {
  ClientEMailComponent,
  ClientIdentificationNumberComponent,
  ClientNameComponent,
  ClientPhoneNumberComponent
} from './components/contact-components';
import {
  CurrentlyInsuredComponent,
  InsuranceCompaniesComponent,
  IsPolicyOwnerComponent,
  NumberAccidentsComponent,
  TimeInsuranceHolderComponent
} from './components/insurance-components';
import { QuoteOfferingsComponent } from './components/offering-components';
import {
  LicensePlateComponent,
  LicenseYearComponent,
  VehicleBrandComponent,
  VehicleModelsComponent,
  VehicleModelVersionsComponent,
  VehicleParkingComponent,
  VehicleTypeComponent,
  YourCarIsComponent
} from './components/vehicle-components';
import { VehicleCharacteristicsComponent } from './components/vehicle-components/vehicle-characteristics/vehicle-characteristics.component';
import { QuoteModel } from './models';
import { BlackListActivator, QuoteActivator } from './service-activators';

const LIBRARY_MANIFEST = {
  birthdate: { component: BirthdateComponent },
  'date-of-issue': { component: DateOfIssueComponent },
  'driving-license-date': { component: DrivingLicenseDateComponent },
  'driving-license-location': { component: DrivingLicenseLocationComponent },
  'is-client': { component: IsClientComponent },
  place: { component: PlaceComponent },
  'apology-screen': { component: ApologyComponent },
  confirmation: { component: ConfirmationComponent },
  'contact-time': { component: ContactTimeComponent },
  'contact-us': { component: ContactUsComponent },
  'on-boarding': { component: OnBoardingComponent },
  'client-email': { component: ClientEMailComponent },
  'client-identification-number': { component: ClientIdentificationNumberComponent },
  'client-name': { component: ClientNameComponent },
  'client-phone-number': { component: ClientPhoneNumberComponent },
  'currently-insured': { component: CurrentlyInsuredComponent },
  'insurance-companies': { component: InsuranceCompaniesComponent },
  'is-policy-owner': { component: IsPolicyOwnerComponent },
  'number-accidents': { component: NumberAccidentsComponent },
  'time-insurance-holder': { component: TimeInsuranceHolderComponent },
  'quote-offerings': { component: QuoteOfferingsComponent },
  'license-plate': { component: LicensePlateComponent },
  'license-year': { component: LicenseYearComponent },
  'vehicle-brand': { component: VehicleBrandComponent },
  'vehicle-characteristics': { component: VehicleCharacteristicsComponent },
  'vehicle-model-versions': { component: VehicleModelVersionsComponent },
  'vehicle-models': { component: VehicleModelsComponent },
  'vehicle-parking': { component: VehicleParkingComponent },
  'vehicle-type': { component: VehicleTypeComponent },
  'your-car-is': { component: YourCarIsComponent }
};

const TRACKING_MANIFEST: TrackManifest = {
  accidents: { path: 'client.accidents', tracked: false },
  dateOfIssue: { path: 'client.dateOfIssue', tracked: false },
  expiration: { path: 'client.expiration', tracked: false },
  client: { path: 'client.isClient', tracked: true },
  insurance: { path: 'client.isPolicyOwner', tracked: true },
  isCurrentlyInsured: { path: 'client.isCurrentlyInsured', tracked: false },
  contactHour: { path: 'contactData.contactHour', tracked: false },
  location: { path: 'driven.licenseCountry', tracked: true },
  drivenLicenseDate: { path: 'driven.licenseDate', tracked: false },
  company: { path: 'insuranceCompany.company.index', tracked: true },
  yearsAsOwner: { path: 'insuranceCompany.yearsAsOwner', tracked: false },
  birthdate: { path: 'personalData.birthdate', tracked: false },
  email: { path: 'personalData.email', tracked: false },
  identificationNumber: { path: 'personalData.identificationNumber', tracked: false },
  name: { path: 'personalData.name', tracked: false },
  surname: { path: 'personalData.surname', tracked: false },
  phoneNumber: { path: 'personalData.phoneNumber', tracked: false },
  postalCode: { path: 'place.postalCode', tracked: false },
  brand: { path: 'vehicle.brand', tracked: true },
  displayment: { path: 'vehicle.cubicCapacity.index', tracked: true },
  fuel: { path: 'vehicle.fuel.index', tracked: true },
  model: { path: 'vehicle.model', tracked: true },
  modelVersion: { path: 'vehicle.modelVersion.index', tracked: false },
  plateNumber: { path: 'vehicle.plateNumber', tracked: false },
  power: { path: 'vehicle.powerRange.index', tracked: false },
  new: { path: 'vehicle.vehicleType', tracked: true },
  yearOfManufacture: { path: 'vehicle.yearOfManufacture', tracked: false },
  vehicleParkingType: { path: 'vehicle.vehicleParkingType', tracked: false }
};

const SERVICE_ACTIVATORS_MANIFEST: Record<ServiceActivatorType, (services: ActivatorServices) => ActivatorFn> = {
  '$black-list-identification-number': BlackListActivator.checkIdentificationNumberBlackList,
  '$black-list-plate': BlackListActivator.checkPlateBlackList,
  '$black-list-phone': BlackListActivator.checkPhoneBlackList,
  '$black-list-email': BlackListActivator.checkEmailBlackList,
  '$reset-quote': QuoteActivator.quoteReset
};

export type WorkflowManifestId = keyof typeof LIBRARY_MANIFEST;

const errorPageId: WorkflowManifestId = 'apology-screen';

export const VEHICLE_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteModel>, QuoteModel>>(
  'VEHICLE_WORKFLOW_TOKEN',
  {
    providedIn: 'root',
    factory: () => ({
      errorPageId: errorPageId,
      manifest: { components: LIBRARY_MANIFEST, serviceActivators: SERVICE_ACTIVATORS_MANIFEST, tracks: TRACKING_MANIFEST },
      initialize: QuoteModel.init,
      hash: QuoteModel.hash
    })
  }
);
