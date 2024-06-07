export interface AIModel {
  id: string;
  object: "model";
  created: number;
  owned_by: string;
  cost?: number;
  disabled?: boolean;
}
