import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { DrivingLicenseDateComponent } from './driving-license-date.component';

describe('DrivingLicenseDateComponent', () => {
  let component: DrivingLicenseDateComponent;
  let fixture: ComponentFixture<DrivingLicenseDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrivingLicenseDateComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrivingLicenseDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
