import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { OfferingsService } from 'src/app/core/services';
import { OfferingPriceModel, QuoteModel } from 'src/app/shared/models';
import { QuoteOfferingPriceCardComponent } from './components';

@Component({
  selector: 'app-quote-offerings',
  templateUrl: './quote-offerings.component.html',
  styleUrl: './quote-offerings.component.scss',
  standalone: true,
  imports: [CommonModule, QuoteOfferingPriceCardComponent]
})
export class QuoteOfferingsComponent implements OnInit {
  @ViewChild('carrouselInner', { static: true })
  private inner!: ElementRef;
  @ViewChild('carrouselTrack', { static: true })
  private track!: ElementRef;

  public selectedPriceIndex = 0;
  public prices: OfferingPriceModel[] = [];

  private swipeCoord!: [number, number];
  private swipeTime!: number;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly offeringsService = inject(OfferingsService);

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);
  }

  ngOnInit(): void {
    this.offeringsService
      .offerings()
      .then(prices => {
        this.prices = prices;
        this.selectedPriceIndex = prices.findIndex(price => price.modalityId === this.contextData.offering.price?.modalityId);
        setTimeout(() => this.selectSteper(this.selectedPriceIndex < 0 ? 0 : this.selectedPriceIndex), 300);
      })
      .catch(error => {
        console.error('Error fetching offerings:', error);
      });
  }

  public swipeStart(e: TouchEvent): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    this.swipeCoord = coord;
    this.swipeTime = time;
    e.preventDefault();
  }

  public swipeEnd(e: TouchEvent): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
    const duration = time - this.swipeTime;

    if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
      // console.log(`swipe ${direction[0] < 0 ? 'next' : 'previous'}`);

      const trackIndex =
        direction[0] < 0
          ? (this.selectedPriceIndex + 1) % this.prices.length
          : (this.selectedPriceIndex - 1 + this.prices.length) % this.prices.length;
      this.selectSteper(trackIndex);
    }

    e.preventDefault();
  }

  public selectSteper(index: number): void {
    this.contextData.offering.price = { ...this.contextData.offering.price, ...this.prices[index] };
    this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);
    this.selectedPriceIndex = index;
    this.selectCarrouselCard();
  }

  /**
   *  set the scroll position of the track to the selected price index
   *  with a smooth transition
   **/
  private selectCarrouselCard(): void {
    const innerWidth = this.inner.nativeElement.clientWidth;
    const screenItems = Math.floor(innerWidth / this.track.nativeElement.childNodes[0].clientWidth);
    const trackCards = this.prices.length - screenItems > this.selectedPriceIndex;
    const selectedCardLeftPosition = this.selectedCardLeftPosition(trackCards ? this.selectedPriceIndex : this.prices.length - screenItems);

    this.track.nativeElement.style.transform = `translateX(${-selectedCardLeftPosition}px)`;
  }

  private selectedCardLeftPosition = (index: number): number =>
    Array.from(this.track.nativeElement.childNodes as NodeList)
      .slice(0, index)
      .reduce<number>((acc, card) => acc + (card as HTMLElement).clientWidth, 0);
}
