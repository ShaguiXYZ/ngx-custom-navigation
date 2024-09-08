/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
export interface PageModel {
  id: string;
  title: string;
  showAsBreadcrumb: boolean;
}

export namespace PageModel {
  export const init = (): PageModel => ({
    id: '',
    title: '',
    showAsBreadcrumb: true
  });
}
