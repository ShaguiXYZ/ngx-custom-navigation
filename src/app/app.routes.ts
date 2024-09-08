import { Routes } from '@angular/router';
import { contextValidGuard } from '@shagui/ng-shagui/core';
import { activatingChildrenGuard } from './shared/guards/activating-children.guard';
import { journeyGuard } from './shared/guards/journey.guard';
import { resetContextGuard } from './shared/guards/reset-context.guard';
import { AppUrls } from './shared/config';

export const HOME_PAGE = AppUrls.onBoarding;

export const routes: Routes = [
  {
    path: AppUrls.onBoarding,
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(c => c.OnboardingComponent),
    canActivate: [contextValidGuard, resetContextGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.isClient,
    loadComponent: () => import('./modules/is-client/is-client.component').then(c => c.IsClientComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.place,
    loadComponent: () => import('./modules/place/place.component').then(c => c.PlaceComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.dateOfIssue,
    loadComponent: () => import('./modules/date-of-issue/date-of-issue.component').then(c => c.DateOfIssueComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.licensePlate,
    loadComponent: () => import('./modules/license-plate/license-plate.component').then(c => c.LicensePlateComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.yourCarIs,
    loadComponent: () => import('./modules/your-car-is/your-car-is.component').then(c => c.YourCarIsComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.contactUs,
    loadComponent: () => import('./modules/contact-us/contact-us.component').then(c => c.ContactUsComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.birthdate,
    loadComponent: () => import('./modules/birthdate/birthdate.component').then(c => c.BirthdateComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.drivingLicenseLocation,
    loadComponent: () =>
      import('./modules/driving-license-location/driving-license-location.component').then(c => c.DrivingLicenseLocationComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.drivingLicenseDate,
    loadComponent: () => import('./modules/driving-license-date/driving-license-date.component').then(c => c.DrivingLicenseDateComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.vehicle,
    loadComponent: () => import('./modules/vehicle/vehicle.component').then(c => c.VehicleComponent),
    canActivate: [journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.make,
    loadComponent: () => import('./modules/make/make.component').then(c => c.MakeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.vehicleType,
    loadComponent: () => import('./modules/vehicle-type/vehicle-type.component').then(c => c.VehicleTypeComponent),
    canActivate: [journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.isPolicyOwner,
    loadComponent: () => import('./modules/is-policy-owner/is-policy-owner.component').then(c => c.IsPolicyOwnerComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.offerings,
    loadComponent: () => import('./modules/quote-offerings/quote-offerings.component').then(c => c.QuoteOfferingsComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.numberAccidents,
    loadComponent: () => import('./modules/number-accidents/number-accidents.component').then(c => c.NumberAccidentsComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.clientName,
    loadComponent: () => import('./modules/client-name/client-name.component').then(c => c.ClientNameComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.clientPhoneNumber,
    loadComponent: () => import('./modules/client-phone-number/client-phone-number.component').then(c => c.ClientPhoneNumberComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.clientEMail,
    loadComponent: () => import('./modules/client-email/client-email.component').then(c => c.ClientEMailComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.clientIdentificationNumber,
    loadComponent: () =>
      import('./modules/client-identification-number/client-identification-number.component').then(
        c => c.ClientIdentificationNumberComponent
      ),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.insuranceCompanies,
    loadComponent: () => import('./modules/insurance-companies/insurance-companies.component').then(c => c.InsuranceCompaniesComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.apology,
    loadComponent: () => import('./modules/apology-screen/apology-screen.component').then(c => c.ApologyComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.pageNotFound,
    loadComponent: () => import('./modules/pagenotfound/pagenotfound.component').then(c => c.PagenotfoundComponent),
    canActivate: [contextValidGuard, journeyGuard],
    canDeactivate: [activatingChildrenGuard]
  },
  {
    path: AppUrls.root,
    pathMatch: 'full',
    redirectTo: `/${HOME_PAGE}`
  }
];
