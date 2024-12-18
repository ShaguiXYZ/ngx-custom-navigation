import { Component } from '@angular/core';
import {
  BirthdateComponent,
  DateOfIssueComponent,
  DrivingLicenseDateComponent,
  DrivingLicenseLocationComponent,
  IsClientComponent,
  PlaceComponent
} from './client-components';
import {
  ApologyComponent,
  ConfirmationComponent,
  ContactTimeComponent,
  ContactUsComponent,
  OnBoardingComponent
} from './common-components';
import {
  ClientEMailComponent,
  ClientIdentificationNumberComponent,
  ClientNameComponent,
  ClientPhoneNumberComponent
} from './contact-components';
import {
  CurrentlyInsuredComponent,
  InsuranceCompaniesComponent,
  IsPolicyOwnerComponent,
  NumberAccidentsComponent,
  TimeInsuranceHolderComponent
} from './insurance-components';
import { QuoteOfferingsComponent } from './offering-components';
import {
  LicensePlateComponent,
  LicenseYearComponent,
  VehicleBrandComponent,
  VehicleFuelComponent,
  VehicleModelsComponent,
  VehicleModelVersionsComponent,
  VehicleTypeComponent,
  YourCarIsComponent
} from './vehicle-components';

export const LIBRARY_MANIFEST = {
  birthdate: { library: 'client-components', name: 'birthdate', component: BirthdateComponent },
  dateOfIssue: { library: 'client-components', name: 'date-of-issue', component: DateOfIssueComponent },
  drivingLicenseDate: { library: 'client-components', name: 'driving-license-date', component: DrivingLicenseDateComponent },
  drivingLicenseLocation: {
    library: 'client-components',
    name: 'driving-license-location',
    component: DrivingLicenseLocationComponent
  },
  isClient: { library: 'client-components', name: 'is-client', component: IsClientComponent },
  place: { library: 'client-components', name: 'place', component: PlaceComponent },
  apologyScreen: { library: 'common-components', name: 'apology', component: ApologyComponent },
  confirmation: { library: 'common-components', name: 'confirmation', component: ConfirmationComponent },
  contactTime: { library: 'common-components', name: 'contact-time', component: ContactTimeComponent },
  contactUs: { library: 'common-components', name: 'contact-us', component: ContactUsComponent },
  onBoarding: { library: 'common-components', name: 'on-boarding', component: OnBoardingComponent },
  clientEmail: { library: 'contact-components', name: 'client-email', component: ClientEMailComponent },
  clientIdentificationNumber: {
    library: 'contact-components',
    name: 'client-identification-number',
    component: ClientIdentificationNumberComponent
  },
  clientName: { library: 'contact-components', name: 'client-name', component: ClientNameComponent },
  clientPhoneNumber: { library: 'contact-components', name: 'client-phone-number', component: ClientPhoneNumberComponent },
  currentlyInsured: { library: 'insurance-components', name: 'currently-insured', component: CurrentlyInsuredComponent },
  insuranceCompanies: { library: 'insurance-components', name: 'insurance-companies', component: InsuranceCompaniesComponent },
  isPolicyOwner: { library: 'insurance-components', name: 'is-policy-owner', component: IsPolicyOwnerComponent },
  numberAccidents: { library: 'insurance-components', name: 'number-accidents', component: NumberAccidentsComponent },
  timeInsuranceHolder: {
    library: 'insurance-components',
    name: 'time-insurance-holder',
    component: TimeInsuranceHolderComponent
  },
  quoteOfferings: { library: 'offering-components', name: 'quote-offerings', component: QuoteOfferingsComponent },
  licensePlate: { library: 'vehicle-components', name: 'license-plate', component: LicensePlateComponent },
  licenseYear: { library: 'vehicle-components', name: 'license-year', component: LicenseYearComponent },
  vehicleBrand: { library: 'vehicle-components', name: 'vehicle-brand', component: VehicleBrandComponent },
  vehicleFuel: { library: 'vehicle-components', name: 'vehicle-fuel', component: VehicleFuelComponent },
  vehicleModelVersions: {
    library: 'vehicle-components',
    name: 'vehicle-model-versions',
    component: VehicleModelVersionsComponent
  },
  vehicleModels: { library: 'vehicle-components', name: 'vehicle-models', component: VehicleModelsComponent },
  vehicleType: { library: 'vehicle-components', name: 'vehicle-type', component: VehicleTypeComponent },
  yourCarIs: { library: 'vehicle-components', name: 'your-car-is', component: YourCarIsComponent }
};

export type WorkflowComponent = keyof typeof LIBRARY_MANIFEST;
