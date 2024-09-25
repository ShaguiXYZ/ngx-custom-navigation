import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment, { Moment } from 'moment';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-date-of-issue',
  templateUrl: './date-of-issue.component.html',
  styleUrl: './date-of-issue.component.scss',
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
    TranslateModule
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class DateOfIssueComponent implements OnInit, IsValidData {
  public form!: FormGroup;
  public dateOfIssueFromContext: Moment | undefined;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);

  constructor(private fb: FormBuilder) {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  ngOnInit(): void {
    this.createForm();
  }

  public canDeactivate = (
    currentRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    next?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> => this.updateValidData();

  private updateValidData = (): boolean => {
    if (this.form.valid) {
      this.contextData.dateOfIssue = {
        ...this.contextData.dateOfIssue,
        ...this.form.value,
        dateOfIssue: moment(new Date(this.form.controls['dateOfIssue'].value)).format('YYYY-MM-DD')
      };

      this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
    }

    return this.form.valid;
  };

  private createForm() {
    if (this.contextData.dateOfIssue.dateOfIssue) {
      this.dateOfIssueFromContext = moment(new Date(this.contextData.dateOfIssue.dateOfIssue));
    }
    this.form = this.fb.group({
      dateOfIssue: new FormControl(this.dateOfIssueFromContext, [Validators.required])
    });
  }
}
