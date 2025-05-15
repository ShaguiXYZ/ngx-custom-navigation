import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { NxRadioComponent, NxRadioGroupComponent } from '@aposin/ng-aquila/radio-button';
import { Subscription } from 'rxjs';
import { FeeModel, OfferingPriceModel, QuoteFooterConfig } from 'src/app/core/models';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe, QuoteNumberPipe } from 'src/app/shared/pipes';
import { HeaderTitleComponent } from '../../../header-title';
import { QuoteFooterComponent } from '../../../quote-footer';
import { hasValue } from '@shagui/ng-shagui/core';

@Component({
  selector: 'quote-offering-price-card',
  templateUrl: './offering-price-card.component.html',
  styleUrl: './offering-price-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public priceSegments: { $int: WritableSignal<string>; $dec: WritableSignal<string> } = {
    $int: signal('0'),
    $dec: signal('00')
  };

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
    this.setPriceSegments();
  }

  public get price(): OfferingPriceModel {
    return this._price;
  }

  public get now(): Date {
    return new Date();
  }

  public get fee(): FeeModel[] {
    return (this._price.fee = this._price.fee ?? []);
  }

  public toggleFee(index: number): void {
    if (index === this.price.feeSelectedIndex) {
      this.price.feeSelectedIndex = undefined;
      this.form.patchValue({ feeSelectedIndex: undefined });
    }
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
        this.setPriceSegments();

        this.uiSelectFee.emit(this.price);
      })
    );
  }

  private setPriceSegments() {
    const price = hasValue(this.price.feeSelectedIndex)
      ? `${this.price.fee[this.price.feeSelectedIndex].amount}`
      : `${this.price.totalPremiumAmount}`;
    const segments = price.split(/[.,]/);

    this.priceSegments.$int.set(segments[0]);
    this.priceSegments.$dec.set(segments.length > 1 ? segments[1] : '00');
  }
}
