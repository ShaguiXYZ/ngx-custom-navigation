import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { IndexedData } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { IIconData, QuoteComponent } from 'src/app/core/models';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
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
    TextCardComponent,
    NxFormfieldModule,
    NxIconModule,
    NxInputModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteTrackDirective,
    QuoteLiteralPipe
  ],
  providers: [InsuranceComponentService, InsuranceCompaniesService],
  standalone: true
})
export class InsuranceCompaniesComponent extends QuoteComponent implements OnInit {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public iconInsurances!: IIconData[];
  public searchedInsurances: IndexedData[] = [];
  public selectedCompany?: IndexedData;

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
      .map(insurance => ({ ...iconDictionary[insurance.index], index: insurance.index } as IIconData));

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

  private createForm(): void {
    this.form = this.fb.group({
      searchInput: new FormControl(this._contextData.insuranceCompany?.company?.data)
    });

    this.subscription$.push(this.searchBoxConfig());
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(() => this.searchInsurances());
  }

  private async searchInsurances(): Promise<void> {
    this.searchedInsurances = this.form.value.searchInput
      ? await this.insuranceCompaniesService.companies(this.form.value.searchInput)
      : [];
  }

  private isValidData = (): boolean => {
    return !!this._contextData.insuranceCompany?.company;
  };
}
