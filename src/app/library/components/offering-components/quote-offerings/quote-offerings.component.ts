import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteError } from 'src/app/core/errors';
import { OfferingPriceModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/library/models';
import { OfferingsService } from 'src/app/library/services/offerings.service';
import { HeaderTitleComponent, OfferingCarrouselComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-quote-offerings',
  templateUrl: './quote-offerings.component.html',
  styleUrl: './quote-offerings.component.scss',
  imports: [CommonModule, HeaderTitleComponent, OfferingCarrouselComponent, QuoteFooterComponent, QuoteLiteralDirective],
  providers: [OfferingsService]
})
export class QuoteOfferingsComponent extends QuoteComponent<QuoteModel> implements OnInit, OnDestroy {
  public prices: OfferingPriceModel[] = [];

  // private resizeObserver!: ResizeObserver;

  private readonly offeringsService = inject(OfferingsService);
  private readonly routingService = inject(RoutingService);

  public get selectedPriceIndex(): number {
    return this._contextData.offering.priceIndex ?? 0;
  }

  async ngOnInit(): Promise<void> {
    try {
      const { prices = [] } = await this.offeringsService.pricing(this._contextData);

      this.prices = prices;
    } catch {
      throw new QuoteError('Error fetching offering prices');
    }

    console.group('Offering prices fetched');
    console.log('Offering prices fetched', this._contextData);
    console.groupEnd();

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
    // this.resizeObserver.disconnect();
  }

  public selectPrice(index: number): void {
    this._contextData.offering.priceIndex = index;
  }

  public callNow(price: OfferingPriceModel): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...price };
  }

  public contactUs(price: OfferingPriceModel): void {
    this._contextData.offering.price = { ...this._contextData.offering.price, ...price };
    this.routingService.next();
  }
}
