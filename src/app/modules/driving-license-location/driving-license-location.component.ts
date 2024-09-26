import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { IsValidData } from 'src/app/shared/guards';
import { IIconData, QuoteModel } from 'src/app/shared/models';
import { DrivingLicenseIcons } from './models';

@Component({
  selector: 'app-driving-license-location',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxButtonModule,
    NxCopytextModule,
    NxHeadlineModule,
    NxIconModule
  ],
  templateUrl: './driving-license-location.component.html',
  styleUrl: './driving-license-location.component.scss'
})
export class DrivingLicenseLocationComponent implements IsValidData {
  @ViewChild('template') infoModal!: TemplateRef<any>;

  public drivenLicenseCountries = DrivingLicenseIcons;
  public selectedLocation?: IIconData;
  public footerConfig!: QuoteFooterConfig;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly dialogService = inject(NxDialogService);

  private contextData!: QuoteModel;

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedLocation = this.drivenLicenseCountries.find(country => country.index === this.contextData.driven.drivenLicenseCountry);
  }

  public selectLocation(icon: IIconData) {
    this.selectedLocation = icon;

    this.routingService.nextStep();
  }

  public openFromTemplate(): void {
    this.dialogService.open(this.infoModal, {
      maxWidth: '350px',
      showCloseIcon: true
    });
  }

  public canDeactivate = (): boolean => {
    return this.updateValidData();
  };

  private updateValidData = (): boolean => {
    this.contextData.driven = {
      ...this.contextData.driven,
      drivenLicenseCountry: this.selectedLocation?.index
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    return true;
  };
}
