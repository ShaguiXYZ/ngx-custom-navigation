/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-namespace */
import { PageModel } from '../../shared/models/page.model';

export interface AppContextData {
  viewedPages: PageModel[];
}

export namespace AppContextData {
  export const init = (): AppContextData => ({
    viewedPages: []
  });
}
