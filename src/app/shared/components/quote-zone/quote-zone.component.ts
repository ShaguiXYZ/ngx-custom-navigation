import { Component, Input, signal, Signal } from '@angular/core';

@Component({
  selector: 'quote-zone',
  template: ` <ng-content></ng-content> `,
  standalone: true
})
export class QuoteZoneComponent {}
