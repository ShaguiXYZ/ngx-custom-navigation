import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';

@Directive({
  selector: '[quoteLink]',
  standalone: true
})
export class QuoteLinkDirective {
  @Input()
  public quoteLink!: string;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

  public ngOnInit(): void {
    this.renderer.listen(this.el.nativeElement, 'click', () => {
      const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      const link = appContextData.configuration.links?.[this.quoteLink];

      link && this.routingService.goToStep(link);
    });
  }
}
