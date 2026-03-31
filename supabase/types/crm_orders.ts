/**
 * @file Supabase types for CRM orders.
 * @description This file defines the TypeScript types for the 'orders' table and related entities.
 */

import type { Client } from './crm_clients.ts';
import type { Product } from './crm_products.ts';

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface Order {
  id: string; // UUID
  created_at: string; // timestamptz
  client_id: string; // Foreign key to clients.id
  client?: Client; // For joined queries
  status: OrderStatus;
  total_amount: number; // numeric
  omie_id?: number | null;
  omie_invoice_id?: string | null;
  items?: OrderItem[] | null; // JSONB or related table
}

export interface OrderItem {
  product_id: string; // Foreign key to products.id
  product?: Product; // For joined queries
  quantity: number;
  unit_price: number;
  total_price: number;
}
