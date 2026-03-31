import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { UpdateOpportunityPayload } from './types.ts';

// This function handles requests for fetching all opportunities (GET)
// and updating an opportunity's stage (PUT).

serve(async (req: Request) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    switch (req.method) {
      case 'GET': {
        const { data: stages, error: stagesError } = await supabase
          .from('sales_funnel_stages')
          .select('id, name, order')
          .order('order', { ascending: true });

        if (stagesError) throw stagesError;

        const { data: opportunities, error: opportunitiesError } = await supabase
          .from('opportunities')
          .select(`id, name, value, client_id, stage_id, created_at, clients (name)`);
        
        if (opportunitiesError) throw opportunitiesError;

        const funnelData = stages.map(stage => ({
          ...stage,
          opportunities: opportunities.filter(op => op.stage_id === stage.id)
        }));

        return new Response(JSON.stringify(funnelData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'PUT': {
        const { opportunityId, newStage } = await req.json();

        if (!opportunityId || !newStage) {
          return new Response(JSON.stringify({ error: 'opportunityId and newStage are required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        const { data, error } = await supabase
          .from('opportunities')
          .update({ stage: newStage, updated_at: new Date().toISOString() })
          .eq('id', opportunityId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      // This POST handler implements the backend logic for the drag-and-drop feature.
      case 'POST': {
        const { opportunityId, stageId }: UpdateOpportunityPayload = await req.json();

        if (!opportunityId || !stageId) {
          return new Response(JSON.stringify({ error: '`opportunityId` and `stageId` are required.' }), 
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        const { data, error } = await supabase
          .from('opportunities')
          .update({ stage_id: stageId, updated_at: new Date().toISOString() })
          .eq('id', opportunityId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
