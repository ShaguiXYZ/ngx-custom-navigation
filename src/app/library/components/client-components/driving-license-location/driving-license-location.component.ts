import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { NxDialogService } from '@allianz/ng-aquila/modal';
import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from '../../../../core/components';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { DrivingLicenseIcons } from './models';

@Component({
  selector: 'quote-driving-license-location',
  templateUrl: './driving-license-location.component.html',
  styleUrl: './driving-license-location.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    QuoteFooterComponent,
    IconCardComponent,
    HeaderTitleComponent,
    NxButtonModule,
    NxCopytextModule,
    NxHeadlineModule,
    QuoteLiteralPipe,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ]
})
export class DrivingLicenseLocationComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public drivenLicenseCountries = DrivingLicenseIcons;
  public selectedLocation?: IndexedData;

  private readonly $infoModal = viewChild.required<ComponentType<unknown>>('template');

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
    this.dialogService.open(this.$infoModal(), {
      maxWidth: '350px',
      showCloseIcon: false
    });
  }

  public override canDeactivate = (): boolean => this.isValidData();

  private isValidData = (): boolean => {
    return !!this._contextData.driven.licenseCountry;
  };
}
