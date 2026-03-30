// supabase/functions/omie-invoice-consult/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callOmieApi } from "../shared/omie-client.ts";

// This endpoint is for Service Orders. Adjust if you are consulting other entities.
const OMIE_CONSULT_ENDPOINT = "/servicos/os/";

console.log("Omie Invoice Consult function started.");

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return new Response(JSON.stringify({ error: "invoiceId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Example call for consulting a Service Order ('ConsultarOS').
    const params = { "nCodOS": invoiceId };
    const omieResponse = await callOmieApi(OMIE_CONSULT_ENDPOINT, "ConsultarOS", params);

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
