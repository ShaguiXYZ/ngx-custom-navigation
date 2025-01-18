import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { QuoteZoneComponent } from '../quote-zone';

@Component({
    selector: 'quote-header-title',
    imports: [QuoteZoneComponent, CommonModule, NxHeadlineModule],
    templateUrl: './header-title.component.html',
    styleUrl: './header-title.component.scss'
})
export class HeaderTitleComponent {}
