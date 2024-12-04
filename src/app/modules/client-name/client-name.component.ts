import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { QuoteFormValidarors } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteZoneComponent } from '../../shared/components/quote-zone/quote-zone.component';

@Component({
  selector: 'quote-client-name',
  templateUrl: './client-name.component.html',
  styleUrl: './client-name.component.scss',
  imports: [
    HeaderTitleComponent,
    NxFormfieldModule,
    NxInputModule,
    QuoteFooterComponent,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe,
    QuoteZoneComponent
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }, QuoteFormValidarors, TitleCasePipe],
  standalone: true
})
export class ClientNameComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._contextData.personalData = {
        ...this._contextData.personalData,
        ...this.form.value
      };
    }
  };

  private createForm() {
    this.form = this.fb.group({
      name: new FormControl(this._contextData.personalData.name, [this.quoteFormValidarors.required()]),
      surname: new FormControl(this._contextData.personalData.surname, [this.quoteFormValidarors.required()])
    });

    let subscription = this.form.get('name')?.valueChanges.subscribe(value => {
      this.form.get('name')?.setValue(this.titleCasePipe.transform(value), { emitEvent: false });
    });

    subscription && this.subscription$.push(subscription);

    subscription = this.form.get('surname')?.valueChanges.subscribe(value => {
      this.form.get('surname')?.setValue(this.titleCasePipe.transform(value), { emitEvent: false });
    });

    subscription && this.subscription$.push(subscription);
  }
}
