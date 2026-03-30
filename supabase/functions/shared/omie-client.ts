// supabase/functions/shared/omie-client.ts
import { OmieCredentials, OmieRequest } from "./types.ts";

const OMIE_API_BASE_URL = "https://app.omie.com.br/api/v1";

/**
 * Retrieves Omie API credentials from environment variables.
 * Throws an error if credentials are not set.
 */
function getOmieCredentials(): OmieCredentials {
  const appKey = Deno.env.get("OMIE_APP_KEY");
  const appSecret = Deno.env.get("OMIE_APP_SECRET");

  if (!appKey || !appSecret) {
    throw new Error("OMIE credentials (OMIE_APP_KEY, OMIE_APP_SECRET) must be set in environment variables.");
  }

  return { appKey, appSecret };
}

/**
 * Makes a POST request to a specific Omie API endpoint.
 * @param endpointPath - The path for the API endpoint (e.g., "/servicos/servico/").
 * @param call - The API method to call (e.g., "IncluirOS").
 * @param params - The parameters for the API call.
 */
export async function callOmieApi(endpointPath: string, call: string, params: any) {
  const { appKey, appSecret } = getOmieCredentials();

  const body: OmieRequest = {
    call,
    app_key: appKey,
    app_secret: appSecret,
    param: [params],
  };

  const url = `${OMIE_API_BASE_URL}${endpointPath}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Omie API request to ${url} failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
