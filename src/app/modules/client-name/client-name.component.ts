import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-client-name',
  templateUrl: './client-name.component.html',
  styleUrl: './client-name.component.scss',
  standalone: true,
  imports: [FormsModule, HeaderTitleComponent, NxFormfieldModule, NxInputModule, QuoteFooterComponent, ReactiveFormsModule],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class ClientNameComponent implements OnInit {
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
    if (this.form.valid) {
      this.contextData.personalData = {
        ...this.contextData.personalData,
        ...this.form.value
      };

      console.log('saving context data', this.contextData);

      this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      name: new FormControl(this.contextData.personalData.name, [Validators.required]),
      surname: new FormControl(this.contextData.personalData.surname, [Validators.required])
    });
  }
}
