import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, RoutingServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { IsPolicyOwnerComponent } from './is-policy-owner.component';

describe('IsPolicyOwnerComponent', () => {
  let component: IsPolicyOwnerComponent;
  let fixture: ComponentFixture<IsPolicyOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsPolicyOwnerComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IsPolicyOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
