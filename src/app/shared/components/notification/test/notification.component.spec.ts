import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { emptyFn, NotificationService } from '@shagui/ng-shagui/core';
import { NotificationServiceMock } from 'src/app/core/mock/services/notification-service.mock';
import { NotificationComponent } from '../notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let services: any;
  let spies: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotificationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: NotificationService, useClass: NotificationServiceMock }]
    })
      .compileComponents()
      .catch(emptyFn);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    component.notifications = [{ id: '1', description: 'test', title: 'test', type: 'regular', timeout: 1000, closable: true }];
    fixture.detectChanges();
    initServices();
  });

  it('should create the sdc notification component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onCloseNotification when close is called', () => {
    component.close('');
    expect(spies.notificationService.closeNotification).toHaveBeenCalled();
  });

  const initServices = () => {
    services = {
      notificationService: TestBed.inject(NotificationService)
    };
    initSpies();
  };

  const initSpies = () => {
    spies = {
      notificationService: {
        closeNotification: spyOn(services.notificationService, 'closeNotification')
      }
    };
  };
});
