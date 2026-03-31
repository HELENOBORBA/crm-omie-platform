/**
 * This file defines the core TypeScript types for the CRM module,
 * corresponding to the Supabase database tables for Omie integration.
 */

/**
 * Represents a client/company in the CRM.
 * Corresponds to the 'companies' table in Supabase.
 */
export interface Company {
  id: string; // uuid
  created_at: string; // timestamptz
  name: string;
  trade_name?: string | null;
  document?: string | null; // CNPJ/CPF
  email?: string | null;
  phone?: string | null;
  address?: Record<string, any> | null; // jsonb
  omie_id?: number | null; // bigint
  metadata?: Record<string, any> | null; // jsonb
}

/**
 * Represents a product or service in the CRM.
 * Corresponds to the 'products' table in Supabase.
 */
export interface Product {
  id: string; // uuid
  created_at: string; // timestamptz
  name: string;
  description?: string | null;
  unit_price?: number | null; // numeric
  unit?: string | null;
  omie_id?: number | null; // bigint
  metadata?: Record<string, any> | null; // jsonb
}

/**
 * Represents a sales order in the CRM.
 * Corresponds to the 'orders' table in Supabase.
 */
export interface Order {
  id: string; // uuid
  created_at: string; // timestamptz
  company_id: string; // uuid
  status: 'draft' | 'confirmed' | 'billed' | 'cancelled';
  total_amount?: number | null; // numeric
  omie_id?: number | null; // bigint
  metadata?: Record<string, any> | null; // jsonb
  order_items?: OrderItem[]; // Relation
}

/**
 * Represents a line item within a sales order.
 * Corresponds to the 'order_items' table in Supabase.
 */
export interface OrderItem {
  id: string; // uuid
  order_id: string; // uuid
  product_id: string; // uuid
  quantity: number; // numeric
  unit_price: number; // numeric
  total_price: number; // numeric (generated)
  metadata?: Record<string, any> | null; // jsonb
}
