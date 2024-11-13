import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { IndexedData } from '@shagui/ng-shagui/core';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { IIconData, QuoteComponent } from 'src/app/core/models';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-insurance-companies',
  standalone: true,
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
    QuoteLiteralPipe
  ],
  providers: [InsuranceCompaniesService],
  templateUrl: './insurance-companies.component.html',
  styleUrl: './insurance-companies.component.scss'
})
export class InsuranceCompaniesComponent extends QuoteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public insurancesWithIcons: string[] = ['c031', 'c058', 'c468', 'camv', 'caxa', 'cing', 'e189', 'm050'];
  public searchedInsurances: IndexedData[] = [];
  public insuranceIconList: IIconData[] = [];
  public selectedCompany?: IndexedData;
  public form!: FormGroup;

  private readonly uriImages = 'assets/images/wm/insurances/company';

  private readonly insuranceCompaniesService = inject(InsuranceCompaniesService);
  private readonly routingService = inject(RoutingService);
  private readonly fb = inject(FormBuilder);

  private subscription$: Subscription[] = [];

  async ngOnInit(): Promise<void> {
    this.selectedCompany = this.contextData.insuranceCompany?.company;

    this.createForm();

    const insurancesList = await this.insuranceCompaniesService.companies();
    this.insuranceIconList = insurancesList
      .filter(insurance => this.insurancesWithIcons.includes(insurance.index.toLowerCase()))
      .map(data => ({ ...data, icon: `${this.uriImages}/${data.index.toLowerCase()}.png` }));

    this.searchInsurances();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public selectCompany(insurance: IndexedData) {
    this.selectedCompany = insurance;

    this.contextData.insuranceCompany = {
      ...this.contextData.insuranceCompany,
      company: this.selectedCompany
    };

    this.routingService.next(this.contextData);
  }

  private createForm(): void {
    this.form = this.fb.group({
      searchInput: new FormControl(this.contextData.insuranceCompany?.company?.data)
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
    return !!this.contextData.insuranceCompany?.company;
  };
}
