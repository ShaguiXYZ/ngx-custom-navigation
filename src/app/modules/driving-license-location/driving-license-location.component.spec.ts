import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/shared/models';
import { DrivingLicenseLocationComponent } from './driving-license-location.component';

describe('DrivingLicenseLocationComponent', () => {
  let component: DrivingLicenseLocationComponent;
  let fixture: ComponentFixture<DrivingLicenseLocationComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let dialogService: jasmine.SpyObj<NxDialogService>;

  beforeEach(async () => {
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const dialogServiceSpy = jasmine.createSpyObj('NxDialogService', ['open']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DrivingLicenseLocationComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: NxDialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLicenseLocationComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    dialogService = TestBed.inject(NxDialogService) as jasmine.SpyObj<NxDialogService>;

    component['contextData'] = {
      driven: {
        drivenLicenseCountry: 'eu'
      }
    } as unknown as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select location and update context data', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    const icon = { index: 'eu', data: 'Country 2' };
    component.selectLocation(icon);

    expect(component.selectedLocation).toEqual(icon);
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        driven: jasmine.objectContaining({
          drivenLicenseCountry: 'eu'
        })
      })
    );
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should open modal from template', () => {
    component.openFromTemplate();

    expect(dialogService.open).toHaveBeenCalledWith(component['infoModal'], {
      maxWidth: '350px',
      showCloseIcon: true
    });
  });

  it('should return true for canDeactivate if data is valid', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false for canDeactivate if data is invalid', () => {
    component['contextData'].driven.drivenLicenseCountry = undefined;

    expect(component.canDeactivate()).toBeFalse();
  });
});
