import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, RoutingServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { IsClientComponent } from './is-client.component';

describe('IsClientComponent', () => {
  let component: IsClientComponent;
  let fixture: ComponentFixture<IsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsClientComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
