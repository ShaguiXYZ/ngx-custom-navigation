import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, IconCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { DrivingLicenseIcons } from './models';

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
    QuoteLiteralPipe,
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

  public selectLocation(icon: IndexedData) {
    this.selectedLocation = icon;

    this._contextData.driven = {
      ...this._contextData.driven,
      licenseCountry: this.selectedLocation?.index
    };

    this.routingService.next();
  }

  public openFromTemplate(): void {
    this.dialogService.open(this.infoModal, {
      maxWidth: '350px',
      showCloseIcon: false
    });
  }

  public override canDeactivate = (): boolean => this.isValidData();

  private isValidData = (): boolean => {
    return !!this._contextData.driven.licenseCountry;
  };
}
