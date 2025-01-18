import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
    selector: 'quote-is-client',
    templateUrl: './is-client.component.html',
    styleUrl: './is-client.component.scss',
    imports: [
        CommonModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        SelectableOptionComponent,
        NxButtonModule,
        QuoteLiteralPipe,
        QuoteLiteralDirective,
        QuoteTrackDirective
    ]
})
export class IsClientComponent extends QuoteComponent<QuoteModel> {
  private readonly routingService = inject(RoutingService);

  public onIsClientChange(value: boolean): void {
    this._contextData.client.isClient = value;

    this.routingService.next();
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public get isClient(): boolean | undefined {
    return this._contextData.client.isClient;
  }

  private isValidData = (): boolean => hasValue(this._contextData.client.isClient);
}
