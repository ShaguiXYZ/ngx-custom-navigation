import { Component } from '@angular/core';

@Component({
  selector: 'quote-zone',
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./quote-zone.component.scss'],
  standalone: true
})
export class QuoteZoneComponent {}
