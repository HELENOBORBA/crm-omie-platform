/**
 * Standard CORS headers for Supabase Edge Functions.
 * Allows requests from any origin and specifies allowed headers for authorization and content type.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
