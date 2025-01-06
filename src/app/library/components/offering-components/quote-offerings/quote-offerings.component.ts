import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NxDialogService, NxModalModule, NxModalRef } from '@aposin/ng-aquila/modal';
import { QuoteComponent } from 'src/app/core/components';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteError } from 'src/app/core/errors';
import { RoutingService } from 'src/app/core/services';
import { OfferingPriceModel, QuoteModel } from 'src/app/library/models';
import { OfferingsService } from 'src/app/library/services/offerings.service';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteOfferingCoveragesComponent, QuoteOfferingPriceCardComponent } from './components';

@Component({
  selector: 'quote-quote-offerings',
  templateUrl: './quote-offerings.component.html',
  styleUrl: './quote-offerings.component.scss',
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteOfferingPriceCardComponent,
    NxModalModule,
    QuoteLiteralDirective
  ],
  providers: [OfferingsService],
  standalone: true
})
export class QuoteOfferingsComponent extends QuoteComponent<QuoteModel> implements OnInit, OnDestroy {
  @ViewChild('carrouselInner', { static: true })
  private inner!: ElementRef;
  @ViewChild('carrouselTrack', { static: true })
  private track!: ElementRef;

  public selectedPriceIndex = 0;
  public prices: OfferingPriceModel[] = [];

  private componentDialogRef?: NxModalRef<QuoteOfferingCoveragesComponent>;
  private swipeCoord!: [number, number];
  private swipeTime!: number;

  private readonly unlistenFns: (() => void)[] = [];
  // private resizeObserver!: ResizeObserver;

  private readonly renderer = inject(Renderer2);
  private readonly offeringsService = inject(OfferingsService);
  private readonly routingService = inject(RoutingService);
  private readonly dialogService = inject(NxDialogService);

  async ngOnInit(): Promise<void> {
    this.offeringsService
      .pricing(this._contextData)
      .then(offering => (this.prices = offering.prices ?? []))
      .catch(() => {
        throw new QuoteError('Error fetching offering prices');
      })
      .finally(() => {
        console.group('Offering prices fetched');
        console.log('Offering prices fetched', this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA));
        console.groupEnd();
      });

    this.unlistenFns.push(
      this.renderer.listen(this.track.nativeElement, 'touchstart', (event: TouchEvent) => this.swipeStart(event)),
      this.renderer.listen(this.track.nativeElement, 'touchend', (event: TouchEvent) => this.swipeEnd(event))
    );

    // this.resizeObserver = new ResizeObserver(entries => {
    //   for (const entry of entries) {
    //     console.log('Element size changed:', entry.contentRect);
    //     // Manejar el cambio de tamaño aquí
    //   }
    // });

    // this.resizeObserver.observe(this.inner.nativeElement);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    this.unlistenFns.forEach(unlisten => unlisten());
    // this.resizeObserver.disconnect();
  }

  public selectSteper(index: number): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...this.prices[index] };
    this.selectedPriceIndex = index;
    this.renderer.setStyle(this.track.nativeElement, 'transition', 'transform 0.5s ease-out');
    this.selectCarrouselCard();
  }

  public next(): void {
    this.selectSteper((this.selectedPriceIndex + 1) % this.prices.length);
  }

  public previous(): void {
    this.selectSteper((this.selectedPriceIndex - 1 + this.prices.length) % this.prices.length);
  }

  public selectFee(event: OfferingPriceModel): void {
    console.log('selectFee', event);
  }

  public showCoverages(index: number) {
    this.selectedPriceIndex = index;

    this.componentDialogRef?.close();
    this.componentDialogRef = this.openFromComponent(QuoteOfferingCoveragesComponent, index);
  }

  public callNow(price: OfferingPriceModel): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...price };
  }

  public contactUs(price: OfferingPriceModel): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...price };
    this.routingService.next();
  }

  private swipeStart(event: TouchEvent): void {
    this.swipeCoord = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    this.swipeTime = new Date().getTime();
  }

  private swipeEnd(event: TouchEvent): void {
    const coord = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    const time = new Date().getTime();
    const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
    const duration = time - this.swipeTime;

    if (duration < 1500 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
      const trackIndex = (this.selectedPriceIndex + (direction[0] < 0 ? 1 : -1) + this.prices.length) % this.prices.length;
      this.selectSteper(trackIndex);
    }
  }

  private openFromComponent<T = unknown>(component: ComponentType<T>, selectedPriceIndex: number): NxModalRef<T> {
    return this.dialogService.open(component, {
      maxWidth: '98%',
      showCloseIcon: true,
      data: {
        selectedPriceIndex
      }
    });
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

    requestAnimationFrame(() => {
      this.renderer.setStyle(this.track.nativeElement, 'transform', `translateX(${-selectedCardLeftPosition}px)`);
    });
  }

  private selectedCardLeftPosition = (index: number): number =>
    Array.from(this.track.nativeElement.childNodes as NodeList)
      .slice(0, index)
      .reduce<number>((acc, card) => acc + (card as HTMLElement).clientWidth, 0);
}
