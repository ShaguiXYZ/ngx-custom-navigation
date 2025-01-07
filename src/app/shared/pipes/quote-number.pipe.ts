import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quoteNumber',
  standalone: true
})
export class QuoteNumberPipe implements PipeTransform {
  transform(value: number): string {
    const priceSegments = `${value}`.split(/[.,]/);

    return priceSegments.length > 1 ? `${priceSegments[0]},${priceSegments[1].padEnd(2, '0')}` : `${value},00`;
  }
}
