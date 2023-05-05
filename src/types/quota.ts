export interface Quota {
  current: number;
  limit: number;
}

// By month
export const GUEST_QUOTA = 10;
export const FREE_QUOTA = 25;
export const PRO_QUOTA = 1000;
