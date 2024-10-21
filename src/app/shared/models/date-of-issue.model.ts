/* eslint-disable @typescript-eslint/no-namespace */

export interface DateOfIssueModel {
  dateOfIssue?: Date;
}

export namespace DateOfIssueModel {
  export const init = (): DateOfIssueModel => ({
    dateOfIssue: undefined
  });
}
