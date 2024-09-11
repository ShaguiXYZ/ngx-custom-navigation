import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxPageSearchModule } from '@aposin/ng-aquila/page-search';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent, QuoteFooterService } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { BrandComponent, BrandData } from 'src/app/shared/components/vehicle-selection';
import { IIconData, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-make',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    QuoteFooterComponent,
    BrandComponent,
    NxPageSearchModule,
    NxIconModule,
    NxFormfieldModule,
    NxInputModule,
    FormsModule
  ],
  templateUrl: './make.component.html',
  styleUrl: './make.component.scss'
})
export class MakeComponent {
  public makes: string[];
  public selectedLocation?: IIconData;
  public footerConfig!: QuoteFooterConfig;
  public selectedMake?: string;
  public searchTerm?: string;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly footerService = inject(QuoteFooterService);
  private readonly routingService = inject(RoutingService);

  // Update constructor
  constructor(private readonly _router: Router) {
    //TODO: Change mock initialization for API call
    this.makes = BrandData.iconBrands();
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);
    // this.selectedLocation = this.makes.find(country => country.label === this.contextData.driven.drivenLicenseCountry);

    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerConfig = {
      validationFn: this.updateValidData,
      showNext: !!navigateTo?.nextOptionList
    };
  }

  public selectMake(event: string): void {
    this.selectedMake = event;
    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerService.nextStep({
      validationFn: this.updateValidData,
      showBack: true,
      showNext: !!navigateTo?.nextOptionList
    });
  }

  /**
   * Actualiza el contexto guardando la marca seleccionada
   */
  private updateValidData = (): boolean => {
    this.contextData.vehicle = {
      ...this.contextData.vehicle,
      make: this.selectedMake!
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);

    return true;
  };
}
