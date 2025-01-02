import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { $, ContextDataService } from '@shagui/ng-shagui/core';
import { filter, Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, HeaderConfig, Page } from 'src/app/core/models';
import { LiteralsService, RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteLinkDirective, QuoteLiteralDirective } from '../../directives';
import { QuoteLiteralPipe } from '../../pipes';

@Component({
  selector: 'quote-header',
  templateUrl: './quote-header.component.html',
  styleUrl: './quote-header.component.scss',
  imports: [CommonModule, NxLinkModule, NxIconModule, QuoteLinkDirective, QuoteLiteralDirective, QuoteLiteralPipe, QuoteTrackDirective],
  standalone: true
})
export class QuoteHeaderComponent implements OnInit, OnDestroy {
  public config: HeaderConfig = {};

  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly literalsService = inject(LiteralsService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly title: Title, private readonly router: Router) {}

  ngOnInit(): void {
    this.subscription$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
        this.config = this.headerConfig(data.navigation.lastPage);
        this.title.setTitle(this.literalsService.toString(data.configuration.title ?? 'title'));
      }),
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.resetHeaderAnimation)
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public return(): void {
    this.routingService.previous();
  }

  private resetHeaderAnimation(): void {
    const headerElement = $('.enhance-header');

    if (headerElement) {
      headerElement.classList.remove('enhance-header');
      void headerElement.offsetWidth; // Trigger reflow
      headerElement.classList.add('enhance-header');
    }
  }

  private headerConfig = (lastPage?: Page): HeaderConfig => {
    const config = lastPage?.configuration?.data?.['headerConfig'] ?? {};

    return { ...{ showBack: true, showContactUs: true }, ...config };
  };
}
