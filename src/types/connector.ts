export type RawResult = {
  [key: string]: any;
};

export interface ExecutionResult {
  rawResult: RawResult[];
  affectedRows?: number;
  error?: string;
}
