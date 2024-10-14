import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { ContextDataService, DataInfo, dateBetween } from '@shagui/ng-shagui/core';
import moment, { Moment } from 'moment';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
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
    ReactiveFormsModule,
    QuoteLiteralDirective
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class BirthdateComponent implements OnInit, IsValidData {
  public form!: FormGroup;
  public birthdateFromContext: Moment | undefined;

  private readonly contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);

  constructor(private readonly fb: FormBuilder) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  ngOnInit(): void {
    this.createForm();
  }

  public canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.updateValidData();

  private updateValidData = (): boolean => {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contextData.personalData = {
        ...this.contextData.personalData,
        ...this.form.value,
        birthdate: moment(new Date(this.form.controls['birthdate'].value)).format('YYYY-MM-DD')
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    if (this.contextData.personalData.birthdate) {
      this.birthdateFromContext = moment(new Date(this.contextData.personalData.birthdate));
    }

    this.form = this.fb.group({
      birthdate: new FormControl(this.birthdateFromContext, [Validators.required, this.clientOldValidator()])
    });
  }

  private clientOldValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const bornDate = new Date(control.value);
      const timeBetween = dateBetween(bornDate, new Date()).years();

      return timeBetween < 18 ? { clientOld: true } : null;
    };
  }
}
