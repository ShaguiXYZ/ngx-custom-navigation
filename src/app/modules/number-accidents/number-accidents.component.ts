import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable, Subscription } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, QuoteFooterService } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-number-accidents',
  templateUrl: './number-accidents.component.html',
  styleUrl: './number-accidents.component.scss',
  standalone: true,
  imports: [FormsModule, HeaderTitleComponent, NxRadioModule, QuoteFooterComponent, QuoteFooterInfoComponent, ReactiveFormsModule],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class NumberAccidentsComponent implements OnInit, OnDestroy, IsValidData {
  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;
  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly footerService = inject(QuoteFooterService);

  constructor(private readonly fb: FormBuilder, private readonly _router: Router) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.footerConfig = {
      showNext: false
    };
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.updateValidData();

  public selectAccidents() {
    // force value changes to trigger
    this.form.patchValue({ accidents: undefined });
  }

  private updateValidData = (): boolean => {
    if (this.form.valid) {
      this.contextData.client = {
        ...this.contextData.client,
        ...this.form.value
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      accidents: new FormControl(this.contextData.client.accidents, [Validators.required])
    });

    this.subscription$.push(
      this.form.valueChanges.subscribe(() => {
        this.footerService.nextStep({
          showNext: this.form.valid
        });
      })
    );
  }
}
