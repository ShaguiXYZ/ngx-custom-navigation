import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

// Modules
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-client-identification-number',
  templateUrl: './client-identification-number.component.html',
  styleUrl: './client-identification-number.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    HeaderTitleComponent,
    NxCopytextModule,
    NxFormfieldModule,
    NxInputModule,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    ReactiveFormsModule
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class ClientIdentificationNumberComponent implements OnInit, IsValidData {
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly fb: FormBuilder, private readonly _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerConfig = {
      showNext: !!navigateTo?.nextOptionList
    };
  }

  ngOnInit(): void {
    this.createForm();
  }

  public canDeactivate = (currentRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot, next?: RouterStateSnapshot): boolean =>
    this.updateValidData();

  private updateValidData = (): boolean => {
    if (this.form.valid) {
      this.contextData.personalData = {
        ...this.contextData.personalData,
        ...this.form.value
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      identificationNumber: new FormControl(this.contextData.personalData.identificationNumber, [Validators.required])
    });
  }
}
