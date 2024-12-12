export interface QuoteSettingsModel {
  agentid: string;
  agentcode: number;
  agenthelpercode: number;
  channel: string;
  company: string;
  groupings: number[];
  office: number;
  partnerid: string;
  commercialExceptions: {
    enableWorkFlow: boolean;
    enableTracking: boolean;
  };
}
