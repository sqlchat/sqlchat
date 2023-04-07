export type Locale = "en" | "zh";

export interface OpenAIApiConfig {
  key: string;
  endpoint: string;
}

export interface Setting {
  locale: Locale;
  openAIApiConfig: OpenAIApiConfig;
}
