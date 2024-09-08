import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteFooterService } from 'src/app/shared/components/quote-footer/services';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, NxButtonModule]
})
export class IsPolicyOwnerComponent {
  private readonly contextDataService = inject(ContextDataService);
  private readonly footerService = inject(QuoteFooterService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  constructor(private _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);
  }

  public onIsPolicyOwnerChange(value: boolean): void {
    this.contextData.client.isPolicyOwner = value;
    this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);

    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerService.nextStep({
      validationFn: this.isValidData,
      showNext: !!navigateTo?.nextOptionList
    });
  }

  public get isPolicyOwner(): boolean | undefined {
    return this.contextData.client.isPolicyOwner;
  }

  private isValidData = (): boolean => hasValue(this.contextData.client.isPolicyOwner);
}
