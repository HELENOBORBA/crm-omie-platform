// supabase/functions/_shared/types.ts

/**
 * Authentication credentials for Omie API.
 * These should be stored as environment variables.
 */
export interface OmieAuth {
  app_key: string;
  app_secret: string;
}

/**
 * Represents a generic call to the Omie API.
 */
export interface OmieRequest<T> {
  call: string;
  app_key: string;
  app_secret: string;
  param: T[];
}

/**
 * Payload for creating an invoice (Nota Fiscal).
 * This is a simplified example. The actual Omie payload is more complex.
 */
export interface CreateInvoiceParams {
  codigo_pedido_integracao: string; // Integration order code
}

/**
 * Response from the invoice creation endpoint.
 */
export interface CreateInvoiceResponse {
  codigo_status: string;
  descricao_status: string;
}

/**
 * Payload for querying an invoice (Nota Fiscal).
 */
export interface GetInvoiceParams {
  cChaveNFe: string; // The electronic invoice key
}

/**
 * Response from the invoice query endpoint.
 */
export interface GetInvoiceResponse {
  ide: {
    nNF: string; // Invoice number
    dEmi: string; // Emission date
  };
  // Add other fields from the actual response
}
