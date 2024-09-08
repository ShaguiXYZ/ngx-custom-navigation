import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment, { Moment } from 'moment';
import { QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-birthdate',
  templateUrl: './birthdate.component.html',
  styleUrl: './birthdate.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    HeaderTitleComponent,
    NxDatefieldModule,
    NxFormfieldModule,
    NxInputModule,
    NxMomentDateModule,
    QuoteFooterComponent,
    ReactiveFormsModule
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class BirthdateComponent implements OnInit {
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;
  public birthdateFromContext: Moment | undefined;

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
        ...this.form.value,
        birthdate: moment(new Date(this.form.controls['birthdate'].value)).format('YYYY-MM-DD')
      };

      console.log('saving context data', this.contextData);

      this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    if (this.contextData.personalData.birthdate) {
      this.birthdateFromContext = moment(new Date(this.contextData.personalData.birthdate));
    }

    this.form = this.fb.group({
      birthdate: new FormControl(this.birthdateFromContext, [Validators.required])
    });
  }
}
