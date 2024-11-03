import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
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

  private readonly routingService = inject(RoutingService);
  private readonly dialogService = inject(NxDialogService);

  ngOnInit(): void {
    this.selectedLocation = this.drivenLicenseCountries.find(country => country.index === this.contextData.driven.drivenLicenseCountry);
  }

  public selectLocation(icon: IndexedData) {
    this.selectedLocation = icon;

    this.contextData.driven = {
      ...this.contextData.driven,
      drivenLicenseCountry: this.selectedLocation?.index
    };

    this.populateContextData();

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
