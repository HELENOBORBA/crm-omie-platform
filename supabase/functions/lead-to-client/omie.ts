/**
 * @file Contains functions for interacting with Omie API related to clients.
 */

import { callOmieApi } from '../_shared/omie_api.ts';
import type { Lead, OmieCreateClientResponse } from './types.ts';

interface OmieClientPayload {
  codigo_cliente_integracao: string;
  email: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone1_ddd?: string;
  telefone1_numero?: string;
  endereco?: string;
}

/**
 * Creates or updates a client in the Omie ERP system.
 * @param lead The lead data from Supabase.
 * @returns The numeric client ID from Omie.
 */
export async function upsertClientInOmie(lead: Lead): Promise<number> {
  const payload: OmieClientPayload = {
    codigo_cliente_integracao: `LEAD_${lead.id}`,
    razao_social: lead.name,
    cnpj_cpf: lead.cnpj_cpf.replace(/\D/g, ''), // Omie requires only digits
    email: lead.email,
    endereco: lead.address || undefined,
  };

  if (lead.phone) {
    const cleanedPhone = lead.phone.replace(/\D/g, '');
    if (cleanedPhone.length >= 10) {
      payload.telefone1_ddd = cleanedPhone.substring(0, 2);
      payload.telefone1_numero = cleanedPhone.substring(2);
    }
  }

  const response = await callOmieApi<OmieCreateClientResponse>({
    call: 'UpsertCliente',
    param: [payload],
  });

  if (response.codigo_status !== '0') {
    console.error('Error creating client in Omie:', response.descricao_status);
    if (response.descricao_status.includes('Já existe um cliente cadastrado com o mesmo CNPJ/CPF')) {
        throw new Error(`OMIE_CONFLICT: ${response.descricao_status}`);
    }
    throw new Error(`OMIE_ERROR: ${response.descricao_status}`);
  }

  return response.codigo_cliente_omie;
}
