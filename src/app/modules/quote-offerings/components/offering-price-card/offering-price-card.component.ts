import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { OfferingPriceModel } from 'src/app/shared/models';

@Component({
  selector: 'quote-offering-price-card',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    NxButtonModule,
    NxCopytextModule,
    NxHeadlineModule,
    NxIconModule,
    NxLinkModule,
    QuoteFooterComponent
  ],
  templateUrl: './offering-price-card.component.html',
  styleUrl: './offering-price-card.component.scss'
})
export class QuoteOfferingPriceCardComponent {
  @Input()
  public selected?: boolean;

  @Output()
  public uiShowCoverages: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiContactUs: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiCallNow: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  public footerConfig!: QuoteFooterConfig;

  private priceSegments: string[] = [];

  private _price!: OfferingPriceModel;

  constructor() {
    this.footerConfig = {
      showNext: true,
      nextLabel: 'LLAMAR AHORA',
      nextFn: this.callNow.bind(this)
    };
  }

  @Input()
  public set price(value: OfferingPriceModel) {
    this._price = value;
    this.priceSegments = this._price.totalPremiumAmount.split(/[.,]/);
  }

  public get price(): OfferingPriceModel {
    return this._price;
  }

  public get priceInteger(): string {
    return this.priceSegments.length ? this.priceSegments[0] : '0';
  }

  public get priceDecimal(): string {
    return this.priceSegments.length > 0 ? this.priceSegments[1] : '00';
  }

  public get now(): Date {
    return new Date();
  }

  public showCoverages(): void {
    this.uiShowCoverages.emit(this.price);
  }

  public contactUs(): void {
    this.uiContactUs.emit(this.price);
  }

  public callNow(): void {
    this.uiCallNow.emit(this.price);
  }
}
