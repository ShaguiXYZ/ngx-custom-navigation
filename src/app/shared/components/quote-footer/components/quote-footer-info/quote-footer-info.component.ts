
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';

@Component({
    selector: 'quote-footer-info',
    imports: [NxCopytextModule],
    templateUrl: './quote-footer-info.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './quote-footer-info.component.scss'
})
export class QuoteFooterInfoComponent {
  @Input()
  public icon?: string;
}
