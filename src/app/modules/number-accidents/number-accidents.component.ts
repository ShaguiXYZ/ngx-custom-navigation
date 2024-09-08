import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-number-accidents',
  templateUrl: './number-accidents.component.html',
  styleUrl: './number-accidents.component.scss',
  standalone: true,
  imports: [FormsModule, HeaderTitleComponent, NxRadioModule, QuoteFooterComponent, QuoteFooterInfoComponent, ReactiveFormsModule],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class NumberAccidentsComponent implements OnInit {
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly fb: FormBuilder, private readonly _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);

    const navigateTo = this.routingService.getPage(this._router.url);
    this.footerConfig = {
      validationFn: this.updateValidData,
      showNext: !!navigateTo?.nextOptionList
    };
  }

  ngOnInit(): void {
    this.createForm();
  }

  private updateValidData = (): boolean => {
    console.log('saving form data', this.form.value);

    if (this.form.valid) {
      this.contextData.client = {
        ...this.contextData.client,
        ...this.form.value
      };

      console.log('saving context data', this.contextData);

      this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      accidents: new FormControl(this.contextData.client.accidents, [Validators.required])
    });
  }
}
