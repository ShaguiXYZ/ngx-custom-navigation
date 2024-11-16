import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { DrivingLicenseIcons } from './models';
import { QuoteTrackDirective, TrackInfo } from 'src/app/core/tracking';

@Component({
  selector: 'quote-driving-license-location',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    NxButtonModule,
    NxCopytextModule,
    NxHeadlineModule,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ],
  templateUrl: './driving-license-location.component.html',
  styleUrl: './driving-license-location.component.scss'
})
export class DrivingLicenseLocationComponent extends QuoteComponent implements OnInit {
  @ViewChild('template')
  private infoModal!: TemplateRef<unknown>;

  public drivenLicenseCountries = DrivingLicenseIcons;
  public selectedLocation?: IndexedData;

  private readonly routingService = inject(RoutingService);
  private readonly dialogService = inject(NxDialogService);

  ngOnInit(): void {
    this.selectedLocation = this.drivenLicenseCountries.find(country => country.index === this._contextData.driven.licenseCountry);
  }

  public get trackInfo(): Partial<TrackInfo> {
    return {
      ...this._trackInfo,
      label: this.quoteLiteral.transform('footer-next'),
      title: this.quoteLiteral.transform('header'),
      drivenLicenseCountry: this.selectedLocation?.index
    };
  }

  public selectLocation(icon: IndexedData) {
    this.selectedLocation = icon;

    this._contextData.driven = {
      ...this._contextData.driven,
      licenseCountry: this.selectedLocation?.index
    };

    this.routingService.next(this._contextData);
  }

  public openFromTemplate(): void {
    this.dialogService.open(this.infoModal, {
      maxWidth: '350px',
      showCloseIcon: true
    });
  }

  public override canDeactivate = (): boolean => this.isValidData();

  private isValidData = (): boolean => {
    return !!this._contextData.driven.licenseCountry;
  };
}
