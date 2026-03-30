/**
 * Default CORS headers for Supabase Edge Functions.
 * Allows requests from any origin and specifies common headers.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
