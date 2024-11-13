import { Routes } from '@angular/router';
import { configContextRoutes } from '@shagui/ng-shagui/core';
import { AppUrls } from './shared/config';
import { canDeactivateGuard, journeyGuard } from './shared/guards';

export const routes: Routes = configContextRoutes([
  {
    path: AppUrls.apology,
    loadComponent: () => import('./modules/apology-screen/apology-screen.component').then(c => c.ApologyComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.birthdate,
    loadComponent: () => import('./modules/birthdate/birthdate.component').then(c => c.BirthdateComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientEMail,
    loadComponent: () => import('./modules/client-email/client-email.component').then(c => c.ClientEMailComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientIdentificationNumber,
    loadComponent: () =>
      import('./modules/client-identification-number/client-identification-number.component').then(
        c => c.ClientIdentificationNumberComponent
      ),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientName,
    loadComponent: () => import('./modules/client-name/client-name.component').then(c => c.ClientNameComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientPhoneNumber,
    loadComponent: () => import('./modules/client-phone-number/client-phone-number.component').then(c => c.ClientPhoneNumberComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.contactUs,
    loadComponent: () => import('./modules/contact-us/contact-us.component').then(c => c.ContactUsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.contactTime,
    loadComponent: () => import('./modules/contact-time/contact-time.component').then(c => c.ContactTimeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.dateOfIssue,
    loadComponent: () => import('./modules/date-of-issue/date-of-issue.component').then(c => c.DateOfIssueComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.drivingLicenseDate,
    loadComponent: () => import('./modules/driving-license-date/driving-license-date.component').then(c => c.DrivingLicenseDateComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.drivingLicenseLocation,
    loadComponent: () =>
      import('./modules/driving-license-location/driving-license-location.component').then(c => c.DrivingLicenseLocationComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.insuranceCompanies,
    loadComponent: () => import('./modules/insurance-companies/insurance-companies.component').then(c => c.InsuranceCompaniesComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.isClient,
    loadComponent: () => import('./modules/is-client/is-client.component').then(c => c.IsClientComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.isPolicyOwner,
    loadComponent: () => import('./modules/is-policy-owner/is-policy-owner.component').then(c => c.IsPolicyOwnerComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.licensePlate,
    loadComponent: () => import('./modules/license-plate/license-plate.component').then(c => c.LicensePlateComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.licenseYear,
    loadComponent: () => import('./modules/license-year/license-year.component').then(c => c.LicenseYearComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.make,
    loadComponent: () => import('./modules/make/make.component').then(c => c.MakeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.numberAccidents,
    loadComponent: () => import('./modules/number-accidents/number-accidents.component').then(c => c.NumberAccidentsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.offerings,
    loadComponent: () => import('./modules/quote-offerings/quote-offerings.component').then(c => c.QuoteOfferingsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.onBoarding,
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(c => c.OnboardingComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.pageNotFound,
    loadComponent: () => import('./modules/pagenotfound/pagenotfound.component').then(c => c.PagenotfoundComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.place,
    loadComponent: () => import('./modules/place/place.component').then(c => c.PlaceComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.timeInsuranceHolder,
    loadComponent: () =>
      import('./modules/time-insurance-holder/time-insurance-holder.component').then(c => c.TimeInsuranceHolderComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleFuel,
    loadComponent: () => import('./modules/vehicle-fuel/vehicle-fuel.component').then(c => c.VehicleFuelComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleModels,
    loadComponent: () => import('./modules/vehicle-models/vehicle-models.component').then(c => c.VehicleModelsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleModelVersions,
    loadComponent: () =>
      import('./modules/vehicle-model-versions/vehicle-model-versions.component').then(c => c.VehicleModelVersionsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleType,
    loadComponent: () => import('./modules/vehicle-type/vehicle-type.component').then(c => c.VehicleTypeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.yourCarIs,
    loadComponent: () => import('./modules/your-car-is/your-car-is.component').then(c => c.YourCarIsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.journeyHome,
    loadComponent: () => import('./modules/journey-home/journey-home.component').then(c => c.JourneyHomeComponent)
  },
  {
    path: AppUrls.root,
    pathMatch: 'full',
    redirectTo: AppUrls.journeyHome
  }
]);
