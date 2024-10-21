import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { Subscription } from 'rxjs';
import { QuoteLiteralDirective } from '../../directives';
import { QuoteFooterConfig } from './models';
import { QuoteFooterService } from './services';

@Component({
  selector: 'quote-footer',
  templateUrl: './quote-footer.component.html',
  styleUrl: './quote-footer.component.scss',
  standalone: true,
  imports: [CommonModule, NxButtonModule, NxIconModule, QuoteLiteralDirective],
  providers: [QuoteFooterService]
})
export class QuoteFooterComponent implements OnInit, OnDestroy {
  @Input()
  public config: QuoteFooterConfig = {
    showNext: true,
    showBack: false
  };

  public _mobileMode?: boolean;
  public _observedMobileMode?: boolean;

  private readonly subscription$: Subscription[] = [];

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly footerService = inject(QuoteFooterService);

  ngOnInit(): void {
    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this._observedMobileMode = state.breakpoints[Breakpoints.HandsetPortrait]))
    );
  }

  get mobileMode(): boolean | undefined {
    return this._mobileMode ?? this._observedMobileMode;
  }

  @Input()
  set mobileMode(value: boolean | undefined) {
    this._mobileMode = value;
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public goToNextStep(): void {
    this.footerService.nextStep(this.config);
  }

  public goToPreviousStep = (): void => this.footerService.previousStep();
}
