export interface QuoteSettingsModel {
  agentid: string;
  agentcode: number;
  agenthelpercode: number;
  channel: string;
  company: string;
  groupings: [number];
  journey: string;
  office: number;
  partnerid: string;
  commercialExceptions: {
    enableWorkFlow: boolean;
    enableTracking: boolean;
  };
}
