export interface QuoteSettingsModel {
  company: string;
  channel: string;
  partnerid: string;
  agentid: string;
  agentcode: number;
  agenthelpercode: number;
  office: number;
  groupings: [number];
  commercialExceptions: {
    enableWorkFlow: boolean;
    enableTracking: boolean;
  };
}
