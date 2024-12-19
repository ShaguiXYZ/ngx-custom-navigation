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
  birthdate: { component: BirthdateComponent },
  dateOfIssue: { component: DateOfIssueComponent },
  drivingLicenseDate: { component: DrivingLicenseDateComponent },
  drivingLicenseLocation: { component: DrivingLicenseLocationComponent },
  isClient: { component: IsClientComponent },
  place: { component: PlaceComponent },
  apologyScreen: { component: ApologyComponent },
  confirmation: { component: ConfirmationComponent },
  contactTime: { component: ContactTimeComponent },
  contactUs: { component: ContactUsComponent },
  onBoarding: { component: OnBoardingComponent },
  clientEmail: { component: ClientEMailComponent },
  clientIdentificationNumber: { component: ClientIdentificationNumberComponent },
  clientName: { component: ClientNameComponent },
  clientPhoneNumber: { component: ClientPhoneNumberComponent },
  currentlyInsured: { component: CurrentlyInsuredComponent },
  insuranceCompanies: { component: InsuranceCompaniesComponent },
  isPolicyOwner: { component: IsPolicyOwnerComponent },
  numberAccidents: { component: NumberAccidentsComponent },
  timeInsuranceHolder: { component: TimeInsuranceHolderComponent },
  quoteOfferings: { component: QuoteOfferingsComponent },
  licensePlate: { component: LicensePlateComponent },
  licenseYear: { component: LicenseYearComponent },
  vehicleBrand: { component: VehicleBrandComponent },
  vehicleFuel: { component: VehicleFuelComponent },
  vehicleModelVersions: { component: VehicleModelVersionsComponent },
  vehicleModels: { component: VehicleModelsComponent },
  vehicleType: { component: VehicleTypeComponent },
  yourCarIs: { component: YourCarIsComponent }
};

export type WorkflowComponent = keyof typeof LIBRARY_MANIFEST;
