import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { situacaoId, dataInicio, dataFinal, individuoID, pagina } = await req.json();

    console.log('Consultando agendamentos com:', { situacaoId, dataInicio, dataFinal, individuoID, pagina });

    const response = await fetch("https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=consultarAgendamentosStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        situacaoId: situacaoId,
        dataInicio: dataInicio,
        dataFinal: dataFinal,
        individuoID: individuoID,
        pagina: pagina
      }),
    });

    console.log('Status da resposta da API externa:', response.status);

    if (!response.ok) {
      console.error('Erro na API externa:', response.status, response.statusText);
      throw new Error(`Erro na API externa: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dados retornados pela API externa:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função consultar-agendamentos-status:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erro ao consultar agendamentos na API externa'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});