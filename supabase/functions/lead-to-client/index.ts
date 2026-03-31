import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { createOmieClient } from './omie.ts';
import type { OmieCreateClientPayload } from './types.ts';

// Initialize Supabase client with service role key for backend operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

/**
 * Main function to handle lead to client conversion.
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { lead_id } = await req.json();
    if (!lead_id) {
      return new Response(JSON.stringify({ error: '`lead_id` is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 1. Fetch lead data from Supabase
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, name, email, document') // Assuming 'document' holds cnpj_cpf
      .eq('id', lead_id)
      .single();

    if (leadError) throw leadError;
    if (!lead) throw new Error(`Lead with ID ${lead_id} not found.`);

    // 2. Prepare payload for Omie API
    const omiePayload: OmieCreateClientPayload = {
      codigo_cliente_integracao: lead.id,
      razao_social: lead.name,
      cnpj_cpf: lead.document,
      email: lead.email,
    };

    // 3. Create client in Omie
    const omieResponse = await createOmieClient(omiePayload);

    // 4. Create client in local Supabase DB
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        lead_id: lead.id,
        name: lead.name,
        email: lead.email,
        document: lead.document,
        omie_client_id: omieResponse.codigo_cliente_omie,
      })
      .select()
      .single();

    if (clientError) throw clientError;

    // 5. Update lead status to 'CONVERTED'
    await supabase
      .from('leads')
      .update({ status: 'CONVERTED' })
      .eq('id', lead.id);

    return new Response(JSON.stringify({ client: newClient }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Lead to client conversion failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
