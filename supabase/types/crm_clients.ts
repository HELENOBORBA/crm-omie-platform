/**
 * @file Supabase types for CRM clients.
 * @description This file defines the TypeScript types for the 'clients' table in Supabase,
 * which stores customer information for the CRM, including synchronization details with Omie.
 */

export interface Client {
  id: string; // UUID
  created_at: string; // timestamptz
  name: string;
  email: string;
  phone?: string | null;
  document: string; // CNPJ or CPF
  omie_id?: number | null;
  address?: Address | null; // JSONB
  tags?: string[] | null; // JSONB
  origin?: string | null;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}
