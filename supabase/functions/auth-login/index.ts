import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const jwtSecret = Deno.env.get('JWT_SECRET')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create JWT signing key
const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(jwtSecret),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

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

    // Buscar usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, nome, sobrenome, email, cpf, senha_hash')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.log('Usuário não encontrado:', email);
      return new Response(
        JSON.stringify({ error: 'Usuário não cadastrado' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar se o usuário tem senha hasheada
    if (!userData.senha_hash) {
      console.log('Usuário sem senha hasheada:', email);
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Usuário encontrado, verificando senha...');

    // Comparar senha usando bcrypt
    const senhaValida = await bcrypt.compare(senha, userData.senha_hash);

    if (!senhaValida) {
      console.log('Senha inválida para usuário:', email);
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Login bem-sucedido para usuário:', userData.id);

    // Gerar JWT
    const payload = {
      sub: userData.id,
      email: userData.email,
      nome: userData.nome,
      iat: getNumericDate(new Date()),
      exp: getNumericDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 horas
    };

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

    // Resposta de sucesso
    const response = {
      token,
      user: {
        id: userData.id,
        nome: userData.nome,
        sobrenome: userData.sobrenome,
        email: userData.email,
        cpf: userData.cpf
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