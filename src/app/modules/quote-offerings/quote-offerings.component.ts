import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxDialogService, NxModalModule } from '@aposin/ng-aquila/modal';
import { OfferingPriceModel, QuoteComponent, SignedModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { OfferingsService } from 'src/app/core/services/offerings.service';
import { QuoteOfferingCoveragesComponent } from 'src/app/shared/components';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteOfferingPriceCardComponent } from './components';
import { Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

@Component({
  selector: 'quote-quote-offerings',
  templateUrl: './quote-offerings.component.html',
  styleUrl: './quote-offerings.component.scss',
  imports: [CommonModule, QuoteOfferingCoveragesComponent, QuoteOfferingPriceCardComponent, NxModalModule],
  providers: [OfferingsService],
  standalone: true
})
export class QuoteOfferingsComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('carrouselInner', { static: true })
  private inner!: ElementRef;
  @ViewChild('carrouselTrack', { static: true })
  private track!: ElementRef;
  @ViewChild('priceCoverages')
  private priceCoveragesRef!: TemplateRef<unknown>;

  public selectedPriceIndex = 0;
  public isMobile = false;
  public prices: OfferingPriceModel[] = [];

  public override ignoreChangeDetection = true;

  private swipeCoord!: [number, number];
  private swipeTime!: number;

  // private resizeObserver!: ResizeObserver;

  private readonly subscription$: Subscription[] = [];

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly offeringsService = inject(OfferingsService);
  private readonly routingService = inject(RoutingService);
  private readonly dialogService = inject(NxDialogService);
  private readonly quoteLiteralPipe = inject(QuoteLiteralPipe);

  async ngOnInit(): Promise<void> {
    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this.isMobile = state.breakpoints[Breakpoints.HandsetPortrait]))
    );

    const offering = await this.offeringsService.pricing(this._contextData);

    this._contextData.offering = { ...this._contextData.offering, quotationId: offering.quotationId, prices: offering.prices };
    this.prices = offering.prices;

    Promise.resolve().then(() => {
      SignedModel.init(this._contextData);
      this.contextDataService.set(QUOTE_CONTEXT_DATA, this._contextData);
      console.log('QuoteOfferingsComponent ngOnInit', this._contextData);
    });

    // this.resizeObserver = new ResizeObserver(entries => {
    //   for (const entry of entries) {
    //     console.log('Element size changed:', entry.contentRect);
    //     // Manejar el cambio de tamaño aquí
    //   }
    // });

    // this.resizeObserver.observe(this.inner.nativeElement);
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public swipeStart(event: TouchEvent): void {
    const coord: [number, number] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    const time = new Date().getTime();

    this.swipeCoord = coord;
    this.swipeTime = time;

    // e.preventDefault();
  }

  public swipeEnd(event: TouchEvent): void {
    const coord: [number, number] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    const time = new Date().getTime();
    const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
    const duration = time - this.swipeTime;

    if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
      const trackIndex =
        direction[0] < 0
          ? (this.selectedPriceIndex + 1) % this.prices.length
          : (this.selectedPriceIndex - 1 + this.prices.length) % this.prices.length;
      this.selectSteper(trackIndex);
    }

    // e.preventDefault();
  }

  public selectSteper(index: number): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...this.prices[index] };
    this.selectedPriceIndex = index;
    this.selectCarrouselCard();
  }

  public selectFee(event: OfferingPriceModel): void {
    console.log('selectFee', event);
  }

  public showCoverages(index: number) {
    this.selectedPriceIndex = index;
    this.dialogService.open(this.priceCoveragesRef, {
      maxWidth: '98%',
      showCloseIcon: false
    });
  }

  public callNow(price: OfferingPriceModel): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...price };

    if (this.isMobile) globalThis.location.href = `tel:${this.quoteLiteralPipe.transform('contact-us-phone')}`;
  }

  public contactUs(price: OfferingPriceModel): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...price };
    this.routingService.next(this._contextData);
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
