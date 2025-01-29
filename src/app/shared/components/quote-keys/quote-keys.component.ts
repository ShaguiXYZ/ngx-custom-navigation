import { Component, HostListener } from '@angular/core';
import { ScreenRecorder } from '@shagui/ng-shagui/core';

@Component({
  selector: 'quote-keys',
  template: ``
})
export class QuoteKeysComponent {
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
        event.preventDefault();
        ScreenRecorder.startRecording();
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
