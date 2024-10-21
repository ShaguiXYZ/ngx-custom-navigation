import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteLinkDirective, QuoteLiteralDirective } from '../../directives';

@Component({
  selector: 'quote-header',
  standalone: true,
  imports: [CommonModule, NxLinkModule, NxIconModule, QuoteLinkDirective, QuoteLiteralDirective],
  templateUrl: './quote-header.component.html',
  styleUrl: './quote-header.component.scss'
})
export class QuoteHeaderComponent implements OnInit, OnDestroy {
  public showBackButton?: boolean;

  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.subscription$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
        this.showBackButton = this.backButtonProperty(data.navigation.lastPage);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public return(): void {
    this.routingService.previousStep();
  }

  private backButtonProperty = (lastPage?: Page): boolean => {
    const showBack = lastPage?.configuration?.data?.['showBack'];

    return typeof showBack === 'boolean' ? showBack : true;
  };
}
