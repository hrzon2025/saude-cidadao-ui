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
    const { atendimentoId, observacao = "Cancelando" } = await req.json();

    console.log('Cancelando consulta:', { atendimentoId, observacao });

    if (!atendimentoId) {
      return new Response(JSON.stringify({ 
        error: 'atendimentoId é obrigatório' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch("https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=confirmarConsulta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        atendimentoId: String(atendimentoId),
        confirmacao: 0,
        observacao: observacao
      }),
    });

    console.log('Status da resposta da API externa:', response.status);

    if (!response.ok) {
      console.error('Erro na API externa:', response.status, response.statusText);
      throw new Error(`Erro na API externa: ${response.status}`);
    }

    // A API retorna resposta vazia em caso de sucesso
    console.log('Consulta cancelada com sucesso');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Consulta cancelada com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função cancelar-consulta:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erro ao cancelar consulta na API externa'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});