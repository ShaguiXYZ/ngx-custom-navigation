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

export type WorkflowComponent = keyof typeof LIBRARY_MANIFEST;
