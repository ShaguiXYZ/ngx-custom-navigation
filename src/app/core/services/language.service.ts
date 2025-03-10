import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { StorageLib } from '../lib';
import { LanguageConfig, Languages, LocaleConfig, NX_LANGUAGE_CONFIG, STORAGE_LANGUAGE_KEY } from '../models';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly config: LanguageConfig;
  private readonly languageChange$ = new Subject<string>();

  constructor(
    @Optional()
    @Inject(NX_LANGUAGE_CONFIG)
    private readonly nxLanguageConfig: Partial<LanguageConfig> & { languages: Record<string, LocaleConfig> } = { languages: Languages },
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(LOCALE_ID) private readonly locale: string,
    private readonly translateService: TranslateService
  ) {
    this.config = this.configureService();
    this.translateService.setDefaultLang(this.config.current);
    this.i18n(this.config.current!);
  }

  public get current(): string {
    return this.config.current;
  }

  public get languages(): Record<string, LocaleConfig> {
    return this.config.languages;
  }

  public async i18n(key: string): Promise<void> {
    if (this.config.languages[key]) {
      await firstValueFrom(this.translateService.use(key));

      this.document.documentElement.lang = key;
      this.config.current = key;

      this.languageChange$.next(this.config.current);

      StorageLib.set(STORAGE_LANGUAGE_KEY, JSON.stringify(this.config), 'local');
    } else {
      console.error(`Language key ${key} not found in language configuration.`);
    }
  }

  public instant = this.translateService.instant.bind(this.translateService);

  public asObservable = (): Observable<string> => this.languageChange$.asObservable();

  private configureService(): LanguageConfig {
    const sessionData = StorageLib.get(STORAGE_LANGUAGE_KEY, 'local');
    const storageConfig: LanguageConfig = sessionData ? JSON.parse(sessionData) : {};
    const languageKeys = Object.keys(this.nxLanguageConfig.languages || {});

    if (storageConfig.current && languageKeys.includes(storageConfig.current)) {
      return { ...this.nxLanguageConfig, current: storageConfig.current };
    } else if (this.nxLanguageConfig.current && languageKeys.includes(this.nxLanguageConfig.current)) {
      return { ...this.nxLanguageConfig, current: this.nxLanguageConfig.current };
    } else if (languageKeys.includes(this.locale)) {
      return { ...this.nxLanguageConfig, current: this.locale };
    } else {
      return { ...this.nxLanguageConfig, current: languageKeys[0] };
    }
  }
}
