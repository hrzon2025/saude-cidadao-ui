import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { cpf, dataNascimento, cns } = await req.json()

    console.log('Validando usuário:', { cpf, dataNascimento })

    // Fazer a chamada para a API externa
    const response = await fetch('https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=consultarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf,
        dataNascimento,
        cns: cns || ""
      })
    })

    const data = await response.json()
    console.log('Resposta da API externa:', { status: response.status, data })

    return new Response(
      JSON.stringify({
        success: response.status === 200 && !data.erro,
        data,
        status: response.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erro na validação do usuário:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})