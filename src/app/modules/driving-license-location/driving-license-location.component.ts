import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { IIconData, QuoteModel } from 'src/app/shared/models';
import { DrivingLicenseIcons } from './models';
import { ContextDataService } from '@shagui/ng-shagui/core';

@Component({
  selector: 'app-driving-license-location',
  standalone: true,
  imports: [CommonModule, IconCardComponent, HeaderTitleComponent, QuoteFooterComponent],
  templateUrl: './driving-license-location.component.html',
  styleUrl: './driving-license-location.component.scss'
})
export class DrivingLicenseLocationComponent {
  public drivenLicenseCountries = DrivingLicenseIcons;
  public selectedLocation?: IIconData;
  public footerConfig!: QuoteFooterConfig;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  constructor(private _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);
    this.selectedLocation = this.drivenLicenseCountries.find(country => country.index === this.contextData.driven.drivenLicenseCountry);

    console.log('context data', this.contextData);

    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerConfig = {
      validationFn: this.updateValidData,
      showNext: !!navigateTo?.nextOptionList
    };
  }

  public selectLocation(icon: IIconData) {
    this.selectedLocation = icon;
  }

  private updateValidData = (): boolean => {
    this.contextData.driven = {
      ...this.contextData.driven,
      drivenLicenseCountry: this.selectedLocation?.index
    };

    console.log('saving context data', this.contextData);

    this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);

    return true;
  };
}
