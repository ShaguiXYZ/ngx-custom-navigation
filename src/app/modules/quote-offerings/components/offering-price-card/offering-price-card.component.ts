import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { Subscription } from 'rxjs';
import { OfferingPriceModel } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-offering-price-card',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    FormsModule,
    ReactiveFormsModule,
    NxButtonModule,
    NxCopytextModule,
    NxHeadlineModule,
    NxLinkModule,
    NxRadioModule,
    QuoteFooterComponent,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  templateUrl: './offering-price-card.component.html',
  styleUrl: './offering-price-card.component.scss'
})
export class QuoteOfferingPriceCardComponent implements OnInit, OnDestroy {
  @Input()
  public selected?: boolean;

  @Output()
  public uiShowCoverages: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiContactUs: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiCallNow: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiSelectFee: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  public form!: FormGroup;

  public footerConfig!: QuoteFooterConfig;

  private priceSegments: string[] = [];

  private _price!: OfferingPriceModel;

  private readonly subdcription$: Subscription[] = [];

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.footerConfig = {
      showNext: true,
      ignoreQuoteConfig: true,
      nextFn: this.callNow.bind(this)
    };

    this.createForm();
  }

  ngOnDestroy(): void {
    this.subdcription$.forEach(sub => sub.unsubscribe());
  }

  @Input()
  public set price(value: OfferingPriceModel) {
    this._price = value;
    this.form?.patchValue({ feeSelectedIndex: this._price.feeSelectedIndex });
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

  public get fee(): string[] {
    return (this._price.fee = this._price.fee || []);
  }

  public showCoverages(): void {
    this.uiShowCoverages.emit(this.price);
  }

  public contactUs(): void {
    this.uiContactUs.emit(this.price);
  }

  public callNow(): boolean {
    this.uiCallNow.emit(this.price);

    return true;
  }

  private createForm() {
    this.form = this.fb.group({
      feeSelectedIndex: new FormControl(this.price.feeSelectedIndex)
    });

    this.subdcription$.push(
      this.form.valueChanges.subscribe(value => {
        this.price.feeSelectedIndex = value.feeSelectedIndex;

        this.uiSelectFee.emit(this.price);
      })
    );
  }
}
