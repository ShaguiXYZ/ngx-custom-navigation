import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { IndexedData } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/components';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { IIconData } from 'src/app/core/models';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, IconCardComponent, QuoteFooterComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { InsuranceComponentService } from './services';

@Component({
  selector: 'quote-insurance-companies',
  templateUrl: './insurance-companies.component.html',
  styleUrl: './insurance-companies.component.scss',
  imports: [
    CommonModule,
    IconCardComponent,
    HeaderTitleComponent,
    QuoteFooterComponent,
    TextCardComponent,
    NxFormfieldModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteTrackDirective,
    QuoteAutoFocusDirective,
    QuoteLiteralPipe
  ],
  providers: [InsuranceComponentService, InsuranceCompaniesService]
})
export class InsuranceCompaniesComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public form!: FormGroup;
  public iconInsurances: IIconData[] = [];
  public searchedInsurances: IndexedData[] = [];
  public selectedCompany?: IndexedData;
  public notFound = false;

  private readonly $searchInput = viewChild.required<ElementRef>('searchInput');

  private readonly routingService = inject(RoutingService);
  private readonly insuranceComponentService = inject(InsuranceComponentService);
  private readonly insuranceCompaniesService = inject(InsuranceCompaniesService);
  private readonly fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.createForm();

    const iconDictionary = await this.insuranceComponentService.iconInsurances();
    const insuranceList = await this.insuranceCompaniesService.companies();

    this.iconInsurances = insuranceList
      .filter(insurance => Object.keys(iconDictionary).includes(insurance.index))
      .map(insurance => ({ ...iconDictionary[insurance.index], index: insurance.index, data: insurance.data } as IIconData));

    this.selectedCompany = this._contextData.insuranceCompany?.company;

    this.searchInsurances();
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public selectCompany(insurance: IndexedData) {
    this.selectedCompany = insurance;

    this._contextData.insuranceCompany = {
      ...this._contextData.insuranceCompany,
      company: this.selectedCompany
    };

    this.routingService.next();
  }

  public clearInput(): void {
    this.form.patchValue({ searchInput: '' });
    this.searchInsurances();
  }

  private createForm(): void {
    this.form = this.fb.group({
      searchInput: [this._contextData.insuranceCompany?.company?.data]
    });

    this.subscription$.push(this.searchBoxConfig());
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.$searchInput().nativeElement, 'keyup')
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(() => this.searchInsurances());
  }

  private async searchInsurances(): Promise<void> {
    if (this.form.value.searchInput || this.iconInsurances.length === 0) {
      this.searchedInsurances = await this.insuranceCompaniesService.companies(this.form.value.searchInput);
      this.notFound = this.searchedInsurances.length === 0;
      return;
    }

    this.searchedInsurances = [];
    this.notFound = this.iconInsurances.length === 0;
  }

  private isValidData = (): boolean => {
    return !!this._contextData.insuranceCompany?.company;
  };
}
