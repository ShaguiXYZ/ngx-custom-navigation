import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { QuoteTranslatePipe } from '../../pipes';

@Component({
  selector: 'quote-translate-text',
  templateUrl: './translate-text.component.html',
  styleUrl: './translate-text.component.scss',
  imports: [CommonModule, QuoteTranslatePipe, NxCopytextModule]
})
export class TranslateTextComponent {
  @Input()
  public text?: string;
}
