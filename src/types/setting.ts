export type Locale = "en" | "zh" | "zhHant" | "es" | "jp" | "de" | "th";

export type Theme = "light" | "dark" | "system";

export interface OpenAIApiConfig {
  key: string;
  endpoint: string;
  model: string;
}

export interface DashScopeApiConfig {
  key: string;
  model: string;
}

export interface Setting {
  locale: Locale;
  theme: Theme;
  openAIApiConfig: OpenAIApiConfig;
  dashScopeApiConfig: DashScopeApiConfig;
  activeProvider: "openai" | "dashscope";
}
