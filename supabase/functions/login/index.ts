import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return new Response(
        JSON.stringify({ error: 'Email e senha são obrigatórios' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Tentativa de login para:', email);

    // Fazer login usando Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (authError) {
      console.error('Erro no login:', authError);
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Erro na autenticação' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Login bem-sucedido para usuário:', authData.user.id);

    // Buscar dados do usuário na tabela users usando o email
    const supabaseService = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    
    const { data: userData, error: userError } = await supabaseService
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('Erro ao buscar dados do usuário:', userError);
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Buscar endereço do usuário
    const { data: addressData, error: addressError } = await supabaseService
      .from('addresses')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    if (addressError) {
      console.error('Erro ao buscar endereço:', addressError);
    }

    // Resposta de sucesso
    const response = {
      access_token: authData.session?.access_token,
      refresh_token: authData.session?.refresh_token,
      user: {
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
          uf: addressData.uf
        } : null
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});