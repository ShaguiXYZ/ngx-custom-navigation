import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { OnboardingComponent } from './onboarding.component';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
