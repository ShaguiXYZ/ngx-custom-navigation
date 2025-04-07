import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { NxRadioComponent, NxRadioGroupComponent } from '@aposin/ng-aquila/radio-button';
import { Subscription } from 'rxjs';
import { OfferingPriceModel, QuoteFooterConfig } from 'src/app/core/models';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe, QuoteNumberPipe } from 'src/app/shared/pipes';
import { HeaderTitleComponent } from '../../../header-title';
import { QuoteFooterComponent } from '../../../quote-footer';

@Component({
  selector: 'quote-offering-price-card',
  templateUrl: './offering-price-card.component.html',
  styleUrl: './offering-price-card.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderTitleComponent,
    NxButtonComponent,
    NxCopytextComponent,
    NxLinkComponent,
    NxRadioGroupComponent,
    NxRadioComponent,
    QuoteFooterComponent,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    QuoteNumberPipe,
    QuoteTrackDirective
  ]
})
export class QuoteOfferingPriceCardComponent implements OnInit, OnDestroy {
  @Input()
  public selected = false;

  @Output()
  public uiShowCoverages: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiContactUs: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiCallNow: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  @Output()
  public uiSelectFee: EventEmitter<OfferingPriceModel> = new EventEmitter<OfferingPriceModel>();

  public isMobile = false;

  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private priceSegments: string[] = [];
  private _price!: OfferingPriceModel;

  private readonly subscription$: Subscription[] = [];
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();

    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this.isMobile = state.breakpoints[Breakpoints.HandsetPortrait]))
    );

    this.footerConfig = {
      showNext: false,
      ignoreQuoteConfig: true
    };
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  @Input()
  public set price(value: OfferingPriceModel) {
    this._price = value;
    this.form?.patchValue({ feeSelectedIndex: this._price.feeSelectedIndex });
    this.priceSegments = `${this._price.totalPremiumAmount}`.split(/[.,]/);
  }

  public get price(): OfferingPriceModel {
    return this._price;
  }

  public get priceInteger(): string {
    return this.priceSegments.length ? this.priceSegments[0] : '0';
  }

  public get priceDecimal(): string {
    return this.priceSegments.length > 1 ? this.priceSegments[1] : '00';
  }

  public get now(): Date {
    return new Date();
  }

  public get fee(): number[] {
    return (this._price.fee = this._price.fee ?? []);
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

  private createForm() {
    this.form = this.fb.group({
      feeSelectedIndex: [this.price.feeSelectedIndex, []]
    });

    this.subscription$.push(
      this.form.valueChanges.subscribe(value => {
        this.price.feeSelectedIndex = value.feeSelectedIndex;

        this.uiSelectFee.emit(this.price);
      })
    );
  }
}
