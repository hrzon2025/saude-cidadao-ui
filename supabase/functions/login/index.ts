import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, senha } = await req.json();

    console.log('Tentativa de login para:', email);

    // 1. Verificar se usuário existe na tabela users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (userError) {
      console.error('Erro ao consultar usuário:', userError);
      return new Response(
        JSON.stringify({ error: 'Erro interno do servidor' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!userData) {
      console.log('Usuário não encontrado na tabela users');
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado. Você precisa estar cadastrado para acessar.' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Usuário encontrado:', userData.nome, userData.sobrenome);

    // 2. Autenticar com Supabase Auth
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (authError) {
      console.error('Erro na autenticação:', authError);
      let errorMessage = 'Erro na autenticação';
      
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Login realizado com sucesso para:', email);

    // 3. Buscar dados completos do usuário incluindo endereço
    const { data: addressData } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('user_id', userData.id)
      .limit(1)
      .maybeSingle();

    // 4. Retornar dados da sessão e do usuário
    const response = {
      session: authData.session,
      user: authData.user,
      profile: {
        id: userData.id,
        nome: userData.nome,
        sobrenome: userData.sobrenome,
        email: userData.email,
        cpf: userData.cpf,
        data_nascimento: userData.data_nascimento,
        genero: userData.genero,
        celular: userData.celular,
        foto: userData.foto,
        endereco: addressData ? {
          cep: addressData.cep,
          logradouro: addressData.logradouro,
          numero: addressData.numero,
          complemento: addressData.complemento,
          bairro: addressData.bairro,
          cidade: addressData.cidade,
          uf: addressData.uf,
        } : null
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});