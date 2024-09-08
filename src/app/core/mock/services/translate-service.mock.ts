/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable } from 'rxjs';

export class TranslateServiceMock {
  private lang = '';

  getLang(): string {
    return 'es-ES';
  }

  setDefaultLang(lang: string): void {
    this.lang = lang;
  }

  stream(key: string | Array<string>, interpolateParams?: object): Observable<string | any> {
    return new Observable<string>();
  }

  instant(key: string | Array<string>, interpolateParams?: object): string | any {
    return key;
  }

  get(key: string) {
    return new Observable<any>();
  }
}
