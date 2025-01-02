import { InjectionToken } from '@angular/core';
import { QuoteComponent } from '../core/components';
import { QuoteWorkflowSettings } from '../core/components/constants';
import { TrackedData } from '../core/tracking';
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
  VehicleFuelComponent,
  VehicleModelsComponent,
  VehicleModelVersionsComponent,
  VehicleTypeComponent,
  YourCarIsComponent
} from './components/vehicle-components';
import { QuoteModel } from './models';

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
  'vehicle-fuel': { component: VehicleFuelComponent },
  'vehicle-model-versions': { component: VehicleModelVersionsComponent },
  'vehicle-models': { component: VehicleModelsComponent },
  'vehicle-type': { component: VehicleTypeComponent },
  'your-car-is': { component: YourCarIsComponent }
};

const TRACKING_MANIFEST: Record<string, TrackedData> = {
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

export type WorkflowManifestId = keyof typeof LIBRARY_MANIFEST;

const errorPageId: WorkflowManifestId = 'apology-screen';

export const VEHICLE_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteModel>, QuoteModel>>(
  'VEHICLE_WORKFLOW_TOKEN',
  {
    providedIn: 'root',
    factory: () => ({
      errorPageId: errorPageId,
      manifest: { components: LIBRARY_MANIFEST, tracks: TRACKING_MANIFEST },
      initialize: QuoteModel.init,
      hash: QuoteModel.hash
    })
  }
);
