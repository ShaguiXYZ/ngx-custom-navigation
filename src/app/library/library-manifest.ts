import { InjectionToken } from '@angular/core';
import { QuoteComponent } from '../core/components';
import { QuoteWorkflowSettings } from '../core/components/constants';
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

type WorkflowComponent = keyof typeof LIBRARY_MANIFEST;

const errorPageId: WorkflowComponent = 'apology-screen';

export const VEHICLE_WORKFLOW_TOKEN = new InjectionToken<QuoteWorkflowSettings<QuoteComponent<QuoteModel>, QuoteModel>>(
  'VEHICLE_WORKFLOW_TOKEN',
  {
    providedIn: 'root',
    factory: () => ({
      errorPageId: errorPageId,
      manifest: LIBRARY_MANIFEST,
      initializedModel: QuoteModel.init,
      signModel: QuoteModel.signModel
    })
  }
);
