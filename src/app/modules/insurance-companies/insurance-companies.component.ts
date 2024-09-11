import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { IIconData, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-insurance-companies',
  standalone: true,
  imports: [CommonModule, IconCardComponent, HeaderTitleComponent, QuoteFooterComponent],
  templateUrl: './insurance-companies.component.html',
  styleUrl: './insurance-companies.component.scss'
})
export class InsuranceCompaniesComponent implements OnInit {
  public insuranceCompanies: IIconData[] = [];
  public selectedCompany?: IIconData;
  public footerConfig!: QuoteFooterConfig;

  private readonly insuranceCompaniesService = inject(InsuranceCompaniesService);
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  constructor(private _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);

    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerConfig = {
      validationFn: this.updateValidData,
      showNext: !!navigateTo?.nextOptionList
    };
  }

  async ngOnInit(): Promise<void> {
    this.insuranceCompanies = await this.insuranceCompaniesService.companies();

    if (this.contextData.insuranceCompany?.company) {
      this.selectedCompany = this.insuranceCompanies.find(country => country.index === this.contextData.insuranceCompany.company);
    }
  }

  public selectCompany(icon: IIconData) {
    this.selectedCompany = icon;
  }

  private updateValidData = (): boolean => {
    this.contextData.insuranceCompany = {
      ...this.contextData.insuranceCompany,
      company: this.selectedCompany?.index
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);

    return true;
  };
}
