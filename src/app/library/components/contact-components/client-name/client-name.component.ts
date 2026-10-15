import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuoteComponent } from '../../../../core/components';
import { QuoteFormValidarors } from '../../../../core/form';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from '../../../../shared/components';
import { QuoteAutoFocusDirective, QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-client-name',
  templateUrl: './client-name.component.html',
  styleUrl: './client-name.component.scss',
  imports: [
    HeaderTitleComponent,
    NxFormfieldModule,
    NxInputModule,
    QuoteFooterComponent,
    QuoteZoneComponent,
    ReactiveFormsModule,
    QuoteAutoFocusDirective,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [QuoteFormValidarors, TitleCasePipe]
})
export class ClientNameComponent extends QuoteComponent<QuoteModel> {
  public form!: FormGroup;

  private readonly quoteFormValidarors = inject(QuoteFormValidarors);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly fb = inject(FormBuilder);

  protected override ngOnQuoteInit = this.createForm.bind(this);

  public override canDeactivate = (): boolean => {
    this._contextData.personalData = {
      ...this._contextData.personalData,
      name: this.form.get('name')?.value?.trim(),
      surname: this.form.get('surname')?.value?.trim()
    };

    return this.form.valid;
  };

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
      name: [this._contextData.personalData.name, [this.quoteFormValidarors.required()]],
      surname: [this._contextData.personalData.surname, [this.quoteFormValidarors.required(3)]]
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
