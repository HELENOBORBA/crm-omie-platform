import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callOmieApi } from '../_shared/omie_api.ts';
import { OmieClient, OmieClientUpsertResponse } from '../_shared/omie_client_types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientData: Partial<OmieClient> = await req.json();

    // Basic validation for required fields
    if (!clientData.codigo_cliente_integracao) {
      throw new Error('`codigo_cliente_integracao` is required.');
    }
    if (!clientData.razao_social) {
      throw new Error('`razao_social` is required.');
    }
    if (!clientData.cnpj_cpf) {
        throw new Error('`cnpj_cpf` is required.');
    }

    // 'UpsertCliente' creates or updates a client based on `codigo_cliente_integracao`.
    const response: OmieClientUpsertResponse = await callOmieApi(
      'UpsertCliente',
      clientData,
    );

    // Check for API-level errors in the response body
    if (response.codigo_status !== '0' && response.descricao_status) {
      throw new Error(`Omie API Error: ${response.descricao_status}`);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
