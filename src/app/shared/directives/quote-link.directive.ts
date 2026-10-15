import { Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../../core/constants';
import { AppContextData } from '../../core/models';
import { RoutingService } from '../../core/services';

@Directive({
  selector: '[nxQuoteLink]'
})
export class QuoteLinkDirective implements OnInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input()
  public nxQuoteLink!: string;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  public ngOnInit(): void {
    this.renderer.listen(this.el.nativeElement, 'click', () => {
      const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      const link = appContextData.configuration.links?.[this.nxQuoteLink];

      if (link) {
        this.routingService.goToPage(link);
      }
    });
  }
}
