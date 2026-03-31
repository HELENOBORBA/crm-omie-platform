/**
 * @file Contains functions for interacting with Omie API related to clients.
 */

import { callOmieApi } from '../_shared/omie_api.ts';
import type { OmieCreateClientPayload, OmieCreateClientResponse } from './types.ts';

/**
 * Creates a new client in Omie by calling the 'IncluirCliente' endpoint.
 * @param clientData - The data for the new client.
 * @returns The response from the Omie API.
 * @throws If the API call results in an error.
 */
export async function createOmieClient(
  clientData: OmieCreateClientPayload
): Promise<OmieCreateClientResponse> {
  const response = await callOmieApi<OmieCreateClientResponse>({
    call: 'IncluirCliente',
    param: [clientData],
  });

  // Omie's API can return errors within a 200 OK response.
  // A non-zero `codigo_status` or a `faultstring` often indicates an issue.
  if (response.codigo_status !== '0' && response.descricao_status) {
    throw new Error(`Omie API Error: ${response.descricao_status}`);
  }

  return response;
}
