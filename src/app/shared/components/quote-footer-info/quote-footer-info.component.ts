import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxMessageModule } from '@aposin/ng-aquila/message';

@Component({
  selector: 'quote-footer-info',
  standalone: true,
  imports: [CommonModule, NxCopytextModule, NxIconModule, NxMessageModule],
  templateUrl: './quote-footer-info.component.html',
  styleUrl: './quote-footer-info.component.scss'
})
export class QuoteFooterInfoComponent {
  @Input()
  public icon?: string;
}
