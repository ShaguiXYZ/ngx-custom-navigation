import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { LanguageService } from 'src/app/core/services';

@Component({
  selector: 'quote-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true
})
export class LanguageComponent implements OnInit {
  @Output()
  public uiChange: EventEmitter<string> = new EventEmitter<string>();

  public languages: string[] = [];
  public currentLanguage!: string;

  private readonly languageService = inject(LanguageService);

  async ngOnInit(): Promise<void> {
    this.languages = Object.keys(this.languageService.languages);
    this.currentLanguage = this.languageService.current;
  }

  public changeLanguage = (lang: string) => {
    this.currentLanguage = lang;
    this.languageService.i18n(lang).then(() => this.uiChange.emit(lang));
  };

  public getLanguageName = (lang: string): string => this.languageService.languages[lang];
}
