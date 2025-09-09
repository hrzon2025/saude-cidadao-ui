import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { cpf, dataNascimento, cns, email } = await req.json();

    console.log('Validando usuário:', { cpf, dataNascimento, cns, email });

    // Fazer chamada para API externa
    const response = await fetch('https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=consultarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf,
        dataNascimento,
        cns
      }),
    });

    console.log('Status da API externa:', response.status);

    if (response.status !== 200) {
      console.log('Usuário não encontrado na API externa');
      return new Response(
        JSON.stringify({ 
          error: 'Usuário não encontrado na base oficial, cadastro não permitido.' 
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userData = await response.json();
    console.log('Dados retornados da API:', userData);

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Inserir usuário no Supabase
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        cpf,
        data_nascimento: dataNascimento,
        cns,
        email,
        nome: userData.nome || null
      });

    if (insertError) {
      console.error('Erro ao inserir usuário:', insertError);
      
      // Verificar se é erro de duplicação
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ 
            error: 'Usuário já cadastrado com este CPF ou e-mail.' 
          }), 
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro interno do servidor. Tente novamente.' 
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Usuário cadastrado com sucesso');

    return new Response(
      JSON.stringify({ 
        message: 'Cadastro realizado com sucesso.' 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro na função validate-user:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor. Tente novamente.' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});