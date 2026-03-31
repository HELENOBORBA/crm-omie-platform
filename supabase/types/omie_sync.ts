/**
 * @file Supabase types for Omie synchronization tracking.
 * @description This file defines the types for a table used to track the synchronization
 * status between Supabase and the Omie ERP.
 */

export type SyncStatus = 'success' | 'failed' | 'in_progress' | 'pending';
export type SyncableTable = 'clients' | 'products' | 'orders' | 'invoices';

export interface OmieSyncStatus {
  id: number; // bigserial
  created_at: string; // timestamptz
  table_name: SyncableTable;
  last_sync_at: string; // timestamptz
  status: SyncStatus;
  details?: Record<string, unknown> | null; // JSONB for error messages or other info
}
