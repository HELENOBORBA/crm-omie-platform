/**
 * @file Supabase types for CRM products.
 * @description This file defines the TypeScript types for the 'products' table in Supabase.
 */

export interface Product {
  id: string; // UUID
  created_at: string; // timestamptz
  name: string;
  description?: string | null;
  unit_price: number; // numeric
  unit: string; // e.g., 'UN', 'KG', 'HR'
  omie_id?: number | null;
  is_active: boolean;
}
