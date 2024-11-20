import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { NxDialogService, NxModalModule, NxModalRef } from '@aposin/ng-aquila/modal';
import { ScreenRecorder } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'quote-keys',
  imports: [CommonModule, NxModalModule],
  templateUrl: './quote-keys.component.html',
  styleUrl: './quote-keys.component.scss',
  standalone: true
})
export class QuoteKeysComponent {
  private readonly dialogService = inject(NxDialogService);

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.eventKeyActions(event);

    // @howto Detect platform
    if (navigator.userAgent.toLowerCase().includes('windows')) {
      this.handleWindowsKeyEvents(event);
    } else {
      this.handleMacKeyEvents(event);
    }
  }

  private openFromComponent<T = unknown>(component: ComponentType<T>): NxModalRef<T> {
    this.dialogService.closeAll();

    return this.dialogService.open(component, {
      maxWidth: '98%',
      showCloseIcon: false
    });
  }

  private handleMacKeyEvents(event: KeyboardEvent) {
    // MetaKey documentation
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey

    event.metaKey && this.eventCtrlKeyActions(event);
  }

  private handleWindowsKeyEvents(event: KeyboardEvent) {
    event.ctrlKey && this.eventCtrlKeyActions(event);
  }

  private eventCtrlKeyActions(event: KeyboardEvent) {
    switch (event.key.toUpperCase()) {
      case 'K':
        event.preventDefault();
        break;
      case 'R':
        ScreenRecorder.startRecording();
        event.preventDefault();
        break;
      case 'P':
      case 'S': {
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  }

  private eventKeyActions(event: KeyboardEvent): void {
    switch (event.key?.toUpperCase()) {
      case 'ESCAPE':
        break;
      case 'F1':
        event.preventDefault();
        break;
      default:
        break;
    }
  }
}
