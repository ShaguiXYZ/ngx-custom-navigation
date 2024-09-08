import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { LocationService, RoutingService } from 'src/app/core/services';
import { LicensePlateComponent } from './license-plate.component';

describe('LicensePlateComponent', () => {
  let component: LicensePlateComponent;
  let fixture: ComponentFixture<LicensePlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicensePlateComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        LocationService,
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LicensePlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
