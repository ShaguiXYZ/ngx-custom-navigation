import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { NotificationModel, NotificationService } from '@shagui/ng-shagui/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'nx-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html',
  imports: [CommonModule, NxButtonModule, NxMessageModule]
})
export class NotificationComponent implements OnInit, OnDestroy {
  public notifications: NotificationModel[] = [];

  private readonly _destroyed = new Subject<void>();

  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService
      .onNotification()
      .pipe(takeUntil(this._destroyed))
      .subscribe(notification => {
        // If there is already a notification with the same title, description and type close it and open again
        // to avoid having duplicate notifications
        this.notifications = this.notifications.filter(
          item => item.title !== notification.title || item.description !== notification.description || item.type !== notification.type
        );

        this.notifications.push(notification);
      });

    this.notificationService
      .onCloseNotification()
      .pipe(takeUntil(this._destroyed))
      .subscribe(notificationId => {
        this.notifications = this.notifications.filter(item => item.id !== notificationId);
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  public close(notificationId: string): void {
    this.notificationService.closeNotification(notificationId);
  }
}
