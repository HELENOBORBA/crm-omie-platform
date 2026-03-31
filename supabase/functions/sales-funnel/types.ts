/**
 * Defines the possible stages of the sales funnel.
 * These should correspond to the values in your database enum.
 */
export const FUNNEL_STAGES = [
  'Prospectando',
  'Qualificação',
  'Proposta',
  'Negociação',
  'Fechado Ganho',
  'Fechado Perdido',
] as const;

export type FunnelStage = typeof FUNNEL_STAGES[number];

/**
 * Represents a sales opportunity in the funnel.
 * This interface should match the structure of the 'opportunities' table.
 */
export interface Opportunity {
  id: string; // UUID
  name: string;
  contact_name?: string;
  value: number;
  stage: FunnelStage;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}
