import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { upsertClientInOmie } from './omie.ts';
import type { Lead, LeadToClientPayload } from './types.ts';

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
    const { lead_id }: LeadToClientPayload = await req.json();
    if (!lead_id) {
      return new Response(JSON.stringify({ error: '`lead_id` is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 1. Fetch lead data from Supabase
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, name, email, phone, cnpj_cpf, address, status') // Assuming 'document' holds cnpj_cpf
      .eq('id', lead_id)
      .single<Lead>();

    if (leadError) throw leadError;
    if (!lead) throw new Error(`Lead with ID ${lead_id} not found.`);
    if (lead.status === 'converted') throw new Error('Lead has already been converted.');

    // 2. Create client in Omie
    const omieClientId = await upsertClientInOmie(lead);

    // 3. Create client in local Supabase DB
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        origin_lead_id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        document: lead.cnpj_cpf,
        address: lead.address,
        id_omie: omieClientId,
      })
      .select('id')
      .single();

    if (clientError) throw clientError;

    // 4. Update lead status to 'converted' and link to new client
    await supabase
      .from('leads')
      .update({ status: 'converted', client_id: newClient.id })
      .eq('id', lead.id);

    return new Response(JSON.stringify({ client_id: newClient.id, omie_id: omieClientId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Lead to client conversion failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
