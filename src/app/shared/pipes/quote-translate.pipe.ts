import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from 'src/app/core/services';

@Pipe({
  name: 'quoteTranslate'
})
export class QuoteTranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  async transform(value: string): Promise<string> {
    if (!value) {
      return value;
    }

    return await this.translationService
      .translate(value)
      .then(response => response.translatedText)
      .catch(() => value);
  }
}
