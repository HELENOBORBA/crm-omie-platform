// supabase/functions/_shared/omie_api.ts

import { OmieAuth, OmieRequest } from './types.ts';

const OMIE_API_BASE_URL = 'https://app.omie.com.br/api/v1';

/**
 * Retrieves Omie API credentials from environment variables.
 * @returns {OmieAuth} The API key and secret.
 * @throws {Error} If environment variables are not set.
 */
function getOmieAuth(): OmieAuth {
  const app_key = Deno.env.get('OMIE_APP_KEY');
  const app_secret = Deno.env.get('OMIE_APP_SECRET');

  if (!app_key || !app_secret) {
    throw new Error('OMIE_APP_KEY and OMIE_APP_SECRET must be set in environment variables.');
  }

  return { app_key, app_secret };
}

/**
 * Makes a generic call to the Omie API.
 * @param endpoint - The specific API endpoint path (e.g., '/financas/nf/').
 * @param call - The name of the API method to call (e.g., 'ConsultarNF').
 * @param params - The parameters for the API call.
 * @returns {Promise<any>} The JSON response from the API.
 */
export async function callOmieAPI<T, R>(endpoint: string, call: string, params: T[]): Promise<R> {
  const auth = getOmieAuth();
  const url = `${OMIE_API_BASE_URL}${endpoint}`;

  const body: OmieRequest<T> = {
    call,
    ...auth,
    param: params,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Omie API request failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}
