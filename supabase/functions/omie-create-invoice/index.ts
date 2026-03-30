// supabase/functions/omie-create-invoice/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { callOmieAPI } from '../_shared/omie_api.ts';
import { CreateInvoiceParams, CreateInvoiceResponse } from '../_shared/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderIntegrationCode } = await req.json();

    if (!orderIntegrationCode) {
      return new Response(JSON.stringify({ error: 'orderIntegrationCode is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params: CreateInvoiceParams[] = [{ codigo_pedido_integracao: orderIntegrationCode }];

    const result = await callOmieAPI<CreateInvoiceParams, CreateInvoiceResponse>(
      '/financas/nf/',
      'IncluirNF',
      params
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
