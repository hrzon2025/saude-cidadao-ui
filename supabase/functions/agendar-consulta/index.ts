import { corsHeaders } from '../_shared/cors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('Edge function agendar-consulta called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const {
      unidadeId,
      profissionalId,
      tipoConsultaId,
      equipeId,
      data,
      hora,
      individuoID,
      cns,
      cpf
    } = body;

    const response = await fetch(
      'https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=agendarConsulta',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unidadeId,
          profissionalId,
          tipoConsultaId,
          equipeId,
          data,
          hora,
          individuoID,
          cns,
          cpf
        }),
      }
    );

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Resposta da API agendarConsulta:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na edge function agendar-consulta:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});