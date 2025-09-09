import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    
    const cpf = formData.get('cpf') as string;
    const dataNascimento = formData.get('dataNascimento') as string;
    const cns = formData.get('cns') as string;
    const nome = formData.get('nome') as string;
    const sobrenome = formData.get('sobrenome') as string;
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;
    const genero = formData.get('genero') as string;
    const celular = formData.get('celular') as string;
    const foto = formData.get('foto') as File;
    
    // Dados do endereço
    const cep = formData.get('cep') as string;
    const logradouro = formData.get('logradouro') as string;
    const numero = formData.get('numero') as string;
    const complemento = formData.get('complemento') as string;
    const bairro = formData.get('bairro') as string;
    const cidade = formData.get('cidade') as string;
    const uf = formData.get('uf') as string;

    console.log('Dados recebidos:', { cpf, email, nome, sobrenome });

    // 1. Validar com API externa
    const validationResponse = await fetch('https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=consultarUsuario', {
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

    if (validationResponse.status !== 200) {
      console.log('Usuário não encontrado na API externa');
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado na base oficial' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const validationData = await validationResponse.json();
    console.log('Validação externa aprovada:', validationData);

    // 2. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar conta de usuário' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const userId = authData.user.id;
    console.log('Usuário criado no Auth:', userId);

    // 3. Upload da foto (se fornecida)
    let fotoUrl = null;
    if (foto && foto.size > 0) {
      const fileName = `${userId}-${Date.now()}.${foto.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, foto, {
          contentType: foto.type,
        });

      if (uploadError) {
        console.error('Erro no upload da foto:', uploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('user-photos')
          .getPublicUrl(fileName);
        fotoUrl = publicUrl;
        console.log('Foto enviada:', fotoUrl);
      }
    }

    // 4. Salvar dados na tabela users
    const userData = {
      id: userId,
      nome,
      sobrenome,
      email,
      cpf,
      data_nascimento: dataNascimento,
      cns,
      genero,
      celular,
      foto: fotoUrl,
    };

    const { data: userResult, error: userError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (userError) {
      console.error('Erro ao salvar usuário:', userError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar dados do usuário' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Usuário salvo na tabela users:', userResult);

    // 5. Salvar endereço na tabela addresses
    const addressData = {
      user_id: userId,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    };

    const { data: addressResult, error: addressError } = await supabase
      .from('addresses')
      .insert([addressData])
      .select()
      .single();

    if (addressError) {
      console.error('Erro ao salvar endereço:', addressError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar endereço' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Endereço salvo:', addressResult);

    // 6. Retornar dados completos
    const response = {
      id: userResult.id,
      nome: userResult.nome,
      sobrenome: userResult.sobrenome,
      email: userResult.email,
      cpf: userResult.cpf,
      data_nascimento: userResult.data_nascimento,
      genero: userResult.genero,
      celular: userResult.celular,
      foto: userResult.foto,
      endereco: {
        cep: addressResult.cep,
        logradouro: addressResult.logradouro,
        numero: addressResult.numero,
        complemento: addressResult.complemento,
        bairro: addressResult.bairro,
        cidade: addressResult.cidade,
        uf: addressResult.uf,
      }
    };

    console.log('Cadastro realizado com sucesso:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});