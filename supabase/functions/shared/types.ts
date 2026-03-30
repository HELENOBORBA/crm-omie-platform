// supabase/functions/shared/types.ts

/**
 * Defines the structure for Omie API credentials.
 */
export interface OmieCredentials {
  appKey: string;
  appSecret: string;
}

/**
 * Defines the generic structure for an Omie API request body.
 */
export interface OmieRequest {
  call: string;
  app_key: string;
  app_secret: string;
  param: any[];
}

/**
 * A generic Omie API error response.
 */
export interface OmieFaultResponse {
  faultcode: string;
  faultstring: string;
}
