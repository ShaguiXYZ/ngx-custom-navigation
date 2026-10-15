import { NxButtonModule } from '@allianz/ng-aquila/button';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from '../../../../core/components';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-is-client',
  templateUrl: './is-client.component.html',
  styleUrl: './is-client.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
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
