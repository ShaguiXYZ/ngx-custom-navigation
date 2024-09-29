import { Location } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { BirthdateComponent } from '../../../modules/birthdate/birthdate.component';
import { ContactUsComponent } from '../../../modules/contact-us/contact-us.component';
import { DateOfIssueComponent } from '../../../modules/date-of-issue/date-of-issue.component';
import { DrivingLicenseDateComponent } from '../../../modules/driving-license-date/driving-license-date.component';
import { IsClientComponent } from '../../../modules/is-client/is-client.component';
import { OnboardingComponent } from '../../../modules/onboarding/onboarding.component';
import { PagenotfoundComponent } from '../../../modules/pagenotfound/pagenotfound.component';
import { PlaceComponent } from '../../../modules/place/place.component';
import { AppUrls } from '../../../shared/config/routing';
import { PageModel } from '../../../shared/models';
import { ContextDataServiceMock, SettingServiceMock } from '../../mock/services';
import { RoutingService } from '../routing.service';
import { SettingsService } from '../setting.service';

const appRoutes: Routes = [
  {
    path: AppUrls.onBoarding,
    component: OnboardingComponent
  },
  {
    path: AppUrls.isClient,
    component: IsClientComponent
  },
  {
    path: AppUrls.place,
    component: PlaceComponent
  },
  {
    path: AppUrls.dateOfIssue,
    component: DateOfIssueComponent
  },
  {
    path: AppUrls.contactUs,
    component: ContactUsComponent
  },
  {
    path: AppUrls.birthdate,
    component: BirthdateComponent
  },
  {
    path: AppUrls.drivingLicenseDate,
    component: DrivingLicenseDateComponent
  },
  {
    path: AppUrls.pageNotFound,
    component: PagenotfoundComponent
  }
];

const setup = async () => {
  const harness = await RouterTestingHarness.create('/on-boarding');
  const location = TestBed.inject(Location);
  return { harness, location };
};

describe('RoutingService', () => {
  let routingService: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        provideHttpClientTesting(),
        provideLocationMocks(),
        { provide: SettingsService, useClass: SettingServiceMock },
        { provide: ContextDataService, useClass: ContextDataServiceMock }
      ]
    })
  );

  beforeEach(() => {
    router = TestBed.inject(Router);
    routingService = TestBed.inject(RoutingService);
  });

  it('should create service', () => {
    expect(routingService).toBeTruthy();
  });

  it('should navigate to next step', fakeAsync(async () => {
    const { location } = await setup();
    routingService
      .nextStep(() => true)
      .then((result: boolean) => {
        expect(result).toBe(true);
        expect(location.path()).toEqual('/is-client');
      });
  }));

  it('should not navigate and return false', fakeAsync(async () => {
    const { location } = await setup();
    routingService
      .nextStep(() => false)
      .then((result: boolean) => {
        expect(result).toBe(false);
        expect(location.path()).toEqual('/on-boarding');
      });
  }));

  it('should not navigate and execute the onError function', fakeAsync(async () => {
    const { location } = await setup();
    routingService
      .nextStep(
        () => false,
        () => true
      )
      .then((result: boolean) => {
        expect(result).toBe(false);
        expect(location.path()).toEqual('/on-boarding');
      });
  }));

  it('should return a empty array because the page has no next option ', fakeAsync(async () => {
    expect(routingService.getNextRoute('/contact-us')).toEqual([]);
  }));

  it('should navigate to next step that match the conditions', fakeAsync(async () => {
    const { location } = await setup();
    routingService
      .nextStep(() => true)
      .then(() => {
        routingService
          .nextStep(() => true)
          .then((result: boolean) => {
            expect(result).toBe(true);
            expect(location.path()).toEqual('/contact-us');
          });
      });
  }));

  it('should navigate to previous step', fakeAsync(async () => {
    const page: PageModel = { id: 'is-client', title: 'Eres cliente', showAsBreadcrumb: false };
    const { location } = await setup();
    routingService.previousStep(page).then((result: boolean) => {
      expect(result).toBe(true);
      expect(location.path()).toEqual('/is-client');
    });
  }));
});
