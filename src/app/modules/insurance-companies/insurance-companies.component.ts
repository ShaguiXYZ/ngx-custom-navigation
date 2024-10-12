import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-insurance-companies',
  standalone: true,
  imports: [CommonModule, IconCardComponent, HeaderTitleComponent, QuoteLiteralDirective],
  templateUrl: './insurance-companies.component.html',
  styleUrl: './insurance-companies.component.scss'
})
export class InsuranceCompaniesComponent implements OnInit, IsValidData {
  public insuranceCompanies: IndexedData[] = [];
  public selectedCompany?: IndexedData;
  public footerConfig!: QuoteFooterConfig;

  private readonly insuranceCompaniesService = inject(InsuranceCompaniesService);
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  async ngOnInit(): Promise<void> {
    this.insuranceCompanies = await this.insuranceCompaniesService.companies();

    if (this.contextData.insuranceCompany?.company) {
      this.selectedCompany = this.insuranceCompanies.find(country => country.index === this.contextData.insuranceCompany.company);
    }
  }

  public canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public selectCompany(icon: IndexedData) {
    this.selectedCompany = icon;

    this.contextData.insuranceCompany = {
      ...this.contextData.insuranceCompany,
      company: this.selectedCompany?.index
    };

    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private isValidData = (): boolean => {
    return !!this.contextData.insuranceCompany?.company;
  };
}
