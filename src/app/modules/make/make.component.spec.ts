import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, RoutingServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { MakeComponent } from './make.component';

describe('MakeComponent', () => {
  let component: MakeComponent;
  let fixture: ComponentFixture<MakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
