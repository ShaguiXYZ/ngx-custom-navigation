import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { $, ContextDataService } from '@shagui/ng-shagui/core';
import { filter, Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, HeaderConfig, Page } from 'src/app/core/models';
import { LiteralsService, RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteLinkDirective, QuoteLiteralDirective } from '../../directives';
import { QuoteLiteralPipe } from '../../pipes';
import { LanguageComponent } from '../language';
import { SwitchThemeComponent } from '../switch-theme';

@Component({
    selector: 'quote-header',
    templateUrl: './quote-header.component.html',
    styleUrl: './quote-header.component.scss',
    imports: [
        LanguageComponent,
        SwitchThemeComponent,
        CommonModule,
        NxCopytextModule,
        NxIconModule,
        QuoteLinkDirective,
        QuoteLiteralDirective,
        QuoteTrackDirective,
        QuoteLiteralPipe
    ]
})
export class QuoteHeaderComponent implements OnInit, OnDestroy {
  @Input()
  public verified?: boolean;

  public config: HeaderConfig = {};

  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly literalsService = inject(LiteralsService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly title: Title, private readonly router: Router, private readonly quoteLiteral: QuoteLiteralPipe) {}

  ngOnInit(): void {
    this.subscription$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
        this.config = this.headerConfig(data.navigation.lastPage);
        this.title.setTitle(this.literalsService.toString(data.configuration.title ?? 'title'));
      }),
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.resetHeaderAnimation)
    );

    this.config = this.headerConfig();
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

    return this.verified ? { ...{ showBack: true, showContactUs: true, showLanguages: true }, ...config } : { showLanguages: true };
  };
}
