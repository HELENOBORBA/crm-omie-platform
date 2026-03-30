// supabase/functions/omie-billing/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callOmieApi } from "../shared/omie-client.ts";

// This endpoint is for Service Orders. Adjust if you are billing products or other entities.
const OMIE_BILLING_ENDPOINT = "/servicos/os/";

console.log("Omie Billing function started.");

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const billingData = await req.json();

    // Example call for creating a Service Order ('IncluirOS').
    // The 'call' and 'params' (billingData) must match Omie's API documentation.
    const omieResponse = await callOmieApi(OMIE_BILLING_ENDPOINT, "IncluirOS", billingData);

    if (omieResponse.faultstring) {
      console.error("Omie API Error:", omieResponse.faultstring);
      return new Response(JSON.stringify({ error: "Omie API error", details: omieResponse.faultstring }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(omieResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
