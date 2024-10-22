import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { ContextDataService, IndexedData } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from 'src/app/core/models';
import { QuoteModel } from 'src/app/shared/models';
import { DrivingLicenseIcons } from './models';

@Component({
  selector: 'quote-driving-license-location',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxButtonModule,
    NxCopytextModule,
    NxHeadlineModule,
    QuoteLiteralDirective
  ],
  templateUrl: './driving-license-location.component.html',
  styleUrl: './driving-license-location.component.scss'
})
export class DrivingLicenseLocationComponent extends QuoteComponent implements OnInit {
  @ViewChild('template')
  private infoModal!: TemplateRef<unknown>;

  public drivenLicenseCountries = DrivingLicenseIcons;
  public selectedLocation?: IndexedData;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly dialogService = inject(NxDialogService);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedLocation = this.drivenLicenseCountries.find(country => country.index === this.contextData.driven.drivenLicenseCountry);
  }

  public selectLocation(icon: IndexedData) {
    this.selectedLocation = icon;

    this.contextData.driven = {
      ...this.contextData.driven,
      drivenLicenseCountry: this.selectedLocation?.index
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  public openFromTemplate(): void {
    this.dialogService.open(this.infoModal, {
      maxWidth: '350px',
      showCloseIcon: true
    });
  }

  public override canDeactivate = (): boolean => this.isValidData();

  private isValidData = (): boolean => {
    return !!this.contextData.driven.drivenLicenseCountry;
  };
}
