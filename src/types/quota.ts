export interface Quota {
  current: number;
  limit: number;
}

export const DEFAULT_QUOTA_LIMIT = 10;
