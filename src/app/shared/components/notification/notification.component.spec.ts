import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { NotificationModel, NotificationService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let notificationSubject: Subject<NotificationModel>;
  let closeNotificationSubject: Subject<string>;

  beforeEach(async () => {
    notificationSubject = new Subject<NotificationModel>();
    closeNotificationSubject = new Subject<string>();

    notificationService = jasmine.createSpyObj('NotificationService', ['onNotification', 'onCloseNotification', 'closeNotification']);
    notificationService.onNotification.and.returnValue(notificationSubject.asObservable());
    notificationService.onCloseNotification.and.returnValue(closeNotificationSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [NotificationComponent, CommonModule, NxButtonModule, NxMessageModule],
      providers: [{ provide: NotificationService, useValue: notificationService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a notification on receiving a new notification', () => {
    const notification: NotificationModel = {
      title: 'Test',
      description: 'Test description',
      type: 'info',
      timeout: 10000,
      closable: true,
      id: '1'
    };
    notificationSubject.next(notification);
    expect(component.notifications.length).toBe(1);
    expect(component.notifications[0]).toEqual(notification);
  });

  it('should remove a notification on receiving a close notification', () => {
    const notification: NotificationModel = {
      title: 'Test',
      description: 'Test description',
      type: 'info',
      timeout: 10000,
      closable: true,
      id: '1'
    };
    component.notifications.push(notification);
    closeNotificationSubject.next(notification.id);
    expect(component.notifications.length).toBe(0);
  });

  it('should not add duplicate notifications', () => {
    const notification: NotificationModel = {
      title: 'Test',
      description: 'Test description',
      type: 'info',
      timeout: 10000,
      closable: true,
      id: '1'
    };
    notificationSubject.next(notification);
    notificationSubject.next(notification);
    expect(component.notifications.length).toBe(1);
  });

  it('should call closeNotification on close', () => {
    const notificationId = '1';
    component.close(notificationId);
    expect(notificationService.closeNotification).toHaveBeenCalledWith(notificationId);
  });

  afterEach(() => {
    notificationSubject.complete();
    closeNotificationSubject.complete();
  });
});
