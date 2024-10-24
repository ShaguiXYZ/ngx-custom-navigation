/* eslint-disable @typescript-eslint/no-namespace */

export interface QuoteDateOfIssueModel {
  dateOfIssue?: Date;
}

export namespace QuoteDateOfIssueModel {
  export const init = (): QuoteDateOfIssueModel => ({
    dateOfIssue: undefined
  });
}
