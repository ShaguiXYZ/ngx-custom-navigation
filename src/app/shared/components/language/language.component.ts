import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { LocaleConfig, LocateType } from 'src/app/core/models';
import { LanguageService } from 'src/app/core/services';

@Component({
  selector: 'quote-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  imports: [NxCopytextModule]
})
export class LanguageComponent implements OnInit {
  @Output()
  public uiChange: EventEmitter<string> = new EventEmitter<string>();

  public languages: LocateType[] = [];
  public currentLanguage!: LocateType;

  private readonly languageService = inject(LanguageService);

  async ngOnInit(): Promise<void> {
    this.languages = Object.keys(this.languageService.languages) as LocateType[];
    this.currentLanguage = this.languageService.current;
  }

  public changeLanguage = (lang: LocateType) => {
    this.currentLanguage = lang;
    this.languageService.i18n(lang).then(() => this.uiChange.emit(lang));
  };

  public getLanguageName = (lang: LocateType): LocaleConfig => this.languageService.languages[lang];
}
