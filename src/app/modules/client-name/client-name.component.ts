import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { Subscription } from 'rxjs';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-client-name',
  templateUrl: './client-name.component.html',
  styleUrl: './client-name.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    NxFormfieldModule,
    NxInputModule,
    QuoteFooterComponent,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [TitleCasePipe, { provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class ClientNameComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;

  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly subscription$: Subscription[] = [];
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.personalData = {
        ...this.contextData.personalData,
        ...this.form.value
      };

      this.populateContextData();
    }

    return this.form.valid;
  };

  private createForm() {
    this.form = this.fb.group({
      name: new FormControl(this.contextData.personalData.name, [Validators.required]),
      surname: new FormControl(this.contextData.personalData.surname, [Validators.required])
    });

    let subscription = this.form.get('name')?.valueChanges.subscribe(value => {
      this.form.get('name')?.setValue(this.titleCasePipe.transform(value), { emitEvent: false });
    });

    if (subscription) {
      this.subscription$.push(subscription);
    }

    subscription = this.form.get('surname')?.valueChanges.subscribe(value => {
      this.form.get('surname')?.setValue(this.titleCasePipe.transform(value), { emitEvent: false });
    });

    if (subscription) {
      this.subscription$.push(subscription);
    }
  }
}
