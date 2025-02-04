import { Component, Input } from '@angular/core';
import { QuoteTranslatePipe } from '../../pipes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'quote-translate-text',
  templateUrl: './translate-text.component.html',
  styleUrl: './translate-text.component.scss',
  imports: [CommonModule, QuoteTranslatePipe]
})
export class TranslateTextComponent {
  @Input()
  public text?: string;
}
