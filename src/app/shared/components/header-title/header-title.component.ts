
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { QuoteZoneComponent } from '../quote-zone';

@Component({
    selector: 'quote-header-title',
    imports: [QuoteZoneComponent, NxHeadlineModule],
    templateUrl: './header-title.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './header-title.component.scss'
})
export class HeaderTitleComponent {}
