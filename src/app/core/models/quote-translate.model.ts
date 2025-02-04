/* eslint-disable @typescript-eslint/no-namespace */
export interface QuoteTranslateRequest {
  q: string;
  source: string;
  target: string;
  format: string;
  alternatives?: number;
  api_key?: string;
}

export namespace QuoteTranslateRequest {
  export function create(text: string, target: string, source = 'auto'): QuoteTranslateRequest {
    return {
      q: text,
      source,
      target,
      format: 'text'
    };
  }
}

export interface QuoteTranslateResponse {
  alternatives: string[];
  detectedLanguage: {
    confidence: number;
    language: string;
  };
  translatedText: string;
}
