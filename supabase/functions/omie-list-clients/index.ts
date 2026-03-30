import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callOmieApi } from '../_shared/omie_api.ts';
import { OmieClientListRequest, OmieClientListResponse } from '../_shared/omie_client_types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { page = 1, records_per_page = 50, only_api_imports = 'N' } = await req.json();

    const params: OmieClientListRequest = {
      pagina: page,
      registros_por_pagina: records_per_page,
      apenas_importado_api: only_api_imports,
    };

    // callOmieApi is assumed to exist and handle authentication.
    const response: OmieClientListResponse = await callOmieApi(
      'ListarClientes',
      params,
    );

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
