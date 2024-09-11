import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { IndexedData } from 'src/app/core/models';
import { LocationService, RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrl: './place.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    NxFormfieldModule,
    NxInputModule,
    NxMaskModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class PlaceComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  private searchInput!: ElementRef;

  public form!: FormGroup;
  public footerConfig!: QuoteFooterConfig;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly locationService = inject(LocationService);
  private readonly routingService = inject(RoutingService);

  private subscription$: Subscription[] = [];

  constructor(private readonly fb: FormBuilder, private readonly _router: Router) {
    const navigateTo = this.routingService.getPage(this._router.url);

    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA_NAME);
    this.footerConfig = {
      validationFn: this.updateValidData,
      showNext: !!navigateTo?.nextOptionList
    };
  }

  ngOnInit(): void {
    this.createForm();

    this.subscription$.push(this.searchBoxConfig());
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  private updateValidData = (): boolean => {
    if (this.form.valid) {
      this.contextData.place = {
        ...this.contextData.place,
        ...this.form.value
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA_NAME, this.contextData);
    }

    return !!this.contextData.place.province;
  };

  public get province(): IndexedData | undefined {
    return this.contextData.place.province;
  }

  private createForm() {
    this.form = this.fb.group({
      postalCode: new FormControl(this.contextData.place.postalCode, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])
    });
  }

  private searchBoxConfig(): Subscription {
    return fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => (this.contextData.place.province = undefined)),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe(() => this.searchPlace());
  }

  private searchPlace() {
    this.locationService.location(this.form.value.postalCode).then(response => (this.contextData.place.province = response));
  }
}
