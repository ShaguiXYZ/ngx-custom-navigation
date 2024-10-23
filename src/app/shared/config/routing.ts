import { RouteConfig } from '@shagui/ng-shagui/core';

export enum AppUrls {
  apology = 'apology-screen',
  birthdate = 'birthdate',
  clientEMail = 'client-email',
  clientIdentificationNumber = 'client-identification-number',
  clientName = 'client-name',
  clientPhoneNumber = 'client-phone-number',
  confirmation = 'confirmation',
  contactUs = 'contact-us',
  contactTime = 'contact-time',
  dateOfIssue = 'date-of-issue',
  drivingLicenseDate = 'driving-license-date',
  drivingLicenseLocation = 'driving-license-location',
  insuranceCompanies = 'insurance-companies',
  isClient = 'is-client',
  isPolicyOwner = 'is-policy-owner',
  journeyHome = 'journey-home',
  licensePlate = 'license-plate',
  licenseYear = 'license-year',
  make = 'make',
  numberAccidents = 'number-accidents',
  offerings = 'offerings',
  onBoarding = 'on-boarding',
  pageNotFound = 'page-not-found',
  place = 'place',
  root = '**',
  timeInsuranceHolder = 'time-insurance-holder',
  vehicleFuel = 'vehicle-fuel',
  vehicleModels = 'vehicle-models',
  vehicleModelVersions = 'vehicle-model-versions',
  vehicleType = 'vehicle-type',
  yourCarIs = 'your-car-is'
}

export const urls: RouteConfig = {
  [AppUrls.birthdate]: { resetContext: false },
  [AppUrls.clientEMail]: { resetContext: false },
  [AppUrls.clientIdentificationNumber]: { resetContext: false },
  [AppUrls.clientName]: { resetContext: false },
  [AppUrls.clientPhoneNumber]: { resetContext: false },
  [AppUrls.confirmation]: { resetContext: false },
  [AppUrls.contactUs]: { resetContext: false },
  [AppUrls.dateOfIssue]: { resetContext: false },
  [AppUrls.drivingLicenseDate]: { resetContext: false },
  [AppUrls.drivingLicenseLocation]: { resetContext: false },
  [AppUrls.insuranceCompanies]: { resetContext: false },
  [AppUrls.isClient]: { resetContext: false },
  [AppUrls.isPolicyOwner]: { resetContext: false },
  [AppUrls.journeyHome]: { resetContext: true },
  [AppUrls.licensePlate]: { resetContext: false },
  [AppUrls.licenseYear]: { resetContext: false },
  [AppUrls.make]: { resetContext: false },
  [AppUrls.numberAccidents]: { resetContext: false },
  [AppUrls.offerings]: { resetContext: false },
  [AppUrls.onBoarding]: { resetContext: false },
  [AppUrls.place]: { resetContext: false },
  [AppUrls.timeInsuranceHolder]: { resetContext: false },
  [AppUrls.vehicleFuel]: { resetContext: false },
  [AppUrls.vehicleModels]: { resetContext: false },
  [AppUrls.vehicleModelVersions]: { resetContext: false },
  [AppUrls.vehicleType]: { resetContext: false },
  [AppUrls.yourCarIs]: { resetContext: false }
};
