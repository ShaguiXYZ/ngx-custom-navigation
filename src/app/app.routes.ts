import { Routes } from '@angular/router';
import { configContextRoutes } from '@shagui/ng-shagui/core';
import { AppUrls } from './shared/config';
import { canDeactivateGuard, journeyGuard } from './shared/guards';

export const routes: Routes = configContextRoutes([
  {
    path: AppUrls.apology,
    loadComponent: () => import('./library/common-components').then(c => c.ApologyComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.birthdate,
    loadComponent: () => import('./library/client-components').then(c => c.BirthdateComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientEMail,
    loadComponent: () => import('./library/contact-components').then(c => c.ClientEMailComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientIdentificationNumber,
    loadComponent: () => import('./library/contact-components').then(c => c.ClientIdentificationNumberComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientName,
    loadComponent: () => import('./library/contact-components').then(c => c.ClientNameComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.clientPhoneNumber,
    loadComponent: () => import('./library/contact-components').then(c => c.ClientPhoneNumberComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.confirmation,
    loadComponent: () => import('./library/common-components').then(c => c.ConfirmationComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.contactUs,
    loadComponent: () => import('./library/common-components').then(c => c.ContactUsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.contactTime,
    loadComponent: () => import('./library/common-components').then(c => c.ContactTimeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.currentlyInsured,
    loadComponent: () => import('./library/insurance-components').then(c => c.CurrentlyInsuredComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.dateOfIssue,
    loadComponent: () => import('./library/client-components').then(c => c.DateOfIssueComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.drivingLicenseDate,
    loadComponent: () => import('./library/client-components').then(c => c.DrivingLicenseDateComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.drivingLicenseLocation,
    loadComponent: () => import('./library/client-components').then(c => c.DrivingLicenseLocationComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.insuranceCompanies,
    loadComponent: () => import('./library/insurance-components').then(c => c.InsuranceCompaniesComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.isClient,
    loadComponent: () => import('./library/client-components').then(c => c.IsClientComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.isPolicyOwner,
    loadComponent: () => import('./library/insurance-components').then(c => c.IsPolicyOwnerComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.licensePlate,
    loadComponent: () => import('./library/vehicle-components').then(c => c.LicensePlateComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.licenseYear,
    loadComponent: () => import('./library/vehicle-components').then(c => c.LicenseYearComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.numberAccidents,
    loadComponent: () => import('./library/insurance-components').then(c => c.NumberAccidentsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.offerings,
    loadComponent: () => import('./library/offering-components').then(c => c.QuoteOfferingsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.onBoarding,
    loadComponent: () => import('./library/common-components').then(c => c.OnBoardingComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.pageNotFound,
    loadComponent: () => import('./library/common-components').then(c => c.PageNotfoundComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.place,
    loadComponent: () => import('./library/client-components').then(c => c.PlaceComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.timeInsuranceHolder,
    loadComponent: () => import('./library/insurance-components').then(c => c.TimeInsuranceHolderComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleBrand,
    loadComponent: () => import('./library/vehicle-components').then(c => c.VehicleBrandComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleFuel,
    loadComponent: () => import('./library/vehicle-components').then(c => c.VehicleFuelComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleModels,
    loadComponent: () => import('./library/vehicle-components').then(c => c.VehicleModelsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleModelVersions,
    loadComponent: () => import('./library/vehicle-components').then(c => c.VehicleModelVersionsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.vehicleType,
    loadComponent: () => import('./library/vehicle-components').then(c => c.VehicleTypeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.yourCarIs,
    loadComponent: () => import('./library/vehicle-components').then(c => c.YourCarIsComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.home,
    loadComponent: () => import('./modules/quote-dispatcher/quote-dispatcher.component').then(c => c.QuoteDispatcherComponent)
  },
  {
    path: `${AppUrls._dispatcher}/:dispatcher`,
    loadComponent: () => import('./modules/quote-dispatcher/quote-dispatcher.component').then(c => c.QuoteDispatcherComponent)
  },
  {
    path: `${AppUrls.stored}/:stored`,
    loadComponent: () => import('./modules/quote-dispatcher/quote-dispatcher.component').then(c => c.QuoteDispatcherComponent)
  },
  {
    path: AppUrls.root,
    pathMatch: 'full',
    redirectTo: AppUrls.home
  }
]);
