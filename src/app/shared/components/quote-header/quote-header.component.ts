import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';

@Component({
  selector: 'quote-header',
  standalone: true,
  imports: [CommonModule, NxLinkModule, NxIconModule],
  templateUrl: './quote-header.component.html',
  styleUrl: './quote-header.component.scss'
})
export class QuoteHeaderComponent implements OnInit, OnDestroy {
  public showBackButton?: boolean;

  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    const subscription = this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
      const pageId = data.navigation.lastPage?.pageId;
      this.showBackButton =
        !!pageId && (!hasValue(data.configuration.pageMap[pageId]?.showBack) || data.configuration.pageMap[pageId]?.showBack);
    });
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public navigateToContactUs() {
    this.routingService.goToStep('contact-us');
  }

  public return() {
    this.routingService.previousStep();
  }
}
