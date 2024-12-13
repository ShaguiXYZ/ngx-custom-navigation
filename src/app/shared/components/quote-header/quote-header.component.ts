import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page } from 'src/app/core/models';
import { LiteralsService, RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteLinkDirective, QuoteLiteralDirective } from '../../directives';
import { QuoteLiteralPipe } from '../../pipes';

interface HeaderConfig {
  showBack?: boolean;
  showContactUs?: boolean;
}

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

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.subscription$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
        this.config = this.headerConfig(data.navigation.lastPage);
        this.title.setTitle(this.literalsService.toString(data.configuration.title ?? 'title'));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public return(): void {
    this.routingService.previous();
  }

  private headerConfig = (lastPage?: Page): HeaderConfig => {
    const config = lastPage?.configuration?.data?.['headerConfig'] ?? {};

    return { ...{ showBack: true, showContactUs: true }, ...config };
  };
}
