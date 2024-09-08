/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

export interface DateOfIssueModel {
  dateOfIssue?: Date;
}

export namespace DateOfIssueModel {
  export const init = (): DateOfIssueModel => ({
    dateOfIssue: undefined
  });
}
