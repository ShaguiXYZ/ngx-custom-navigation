import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { DrivingLicenseLocationComponent } from './driving-license-location.component';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';

describe('DrivingLicenseLocationComponent', () => {
  let component: DrivingLicenseLocationComponent;
  let fixture: ComponentFixture<DrivingLicenseLocationComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let dialogService: jasmine.SpyObj<NxDialogService>;

  beforeEach(async () => {
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const dialogServiceSpy = jasmine.createSpyObj('NxDialogService', ['open']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DrivingLicenseLocationComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: NxDialogService, useValue: dialogServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLicenseLocationComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    dialogService = TestBed.inject(NxDialogService) as jasmine.SpyObj<NxDialogService>;

    component['_contextData'] = {
      driven: {
        licenseCountry: 'eu'
      }
    } as unknown as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select location and update context data', () => {
    const icon = { index: 'eu', data: 'Country 2' };
    component.selectLocation(icon);

    expect(component.selectedLocation).toEqual(icon);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should open modal from template', () => {
    component.openFromTemplate();

    expect(dialogService.open).toHaveBeenCalledWith(component['infoModal'], {
      maxWidth: '350px',
      showCloseIcon: false
    });
  });

  it('should return true for canDeactivate if data is valid', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false for canDeactivate if data is invalid', () => {
    component['_contextData'].driven.licenseCountry = undefined;

    expect(component.canDeactivate()).toBeFalse();
  });
});
