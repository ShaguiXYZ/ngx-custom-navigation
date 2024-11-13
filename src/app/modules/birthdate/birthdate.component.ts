import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import moment, { Moment } from 'moment';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
import { isOlderThanYears } from 'src/app/core/form';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-birthdate',
  templateUrl: './birthdate.component.html',
  styleUrl: './birthdate.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    NxDatefieldModule,
    NxFormfieldModule,
    NxInputModule,
    NxMomentDateModule,
    QuoteFooterComponent,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class BirthdateComponent extends QuoteComponent implements OnInit {
  public form!: FormGroup;
  public birthdateFromContext: Moment | undefined;
  public minValue = 18;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  public override canDeactivate = (): boolean => this.form.valid;

  public updateValidData = (): void => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.personalData = {
        ...this.contextData.personalData,
        ...this.form.value,
        birthdate: moment(new Date(this.form.controls['birthdate'].value)).format(DEFAULT_DATE_FORMAT)
      };
    }
  };

  private createForm() {
    if (this.contextData.personalData.birthdate) {
      this.birthdateFromContext = moment(new Date(this.contextData.personalData.birthdate));
    }

    this.form = this.fb.group(
      {
        birthdate: new FormControl(this.birthdateFromContext, [Validators.required, isOlderThanYears(this.minValue)])
      },
      { updateOn: 'blur' }
    );
  }
}
