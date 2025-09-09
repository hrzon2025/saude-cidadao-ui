import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const formData = await req.formData();
    
    // Extract form fields
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
    
    // Extract address fields
    const cep = formData.get('cep') as string;
    const logradouro = formData.get('logradouro') as string;
    const numero = formData.get('numero') as string;
    const complemento = formData.get('complemento') as string;
    const bairro = formData.get('bairro') as string;
    const cidade = formData.get('cidade') as string;
    const uf = formData.get('uf') as string;

    console.log('Iniciando validação externa...');
    
    // Validação na API externa
    const validationResponse = await fetch('https://homologacao.mbx.portalmas.com.br/mobilex.rule?sys=MOB&acao=consultarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf,
        dataNascimento,
        cns
      })
    });

    console.log('Status da validação externa:', validationResponse.status);
    
    if (!validationResponse.ok) {
      console.log('Erro na validação externa');
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado na base oficial' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const validationData = await validationResponse.json();
    console.log('Dados da validação:', validationData);
    
    // Se chegou até aqui, o usuário é válido, continuar com o cadastro
    let fotoUrl = null;
    
    // Upload da foto se fornecida
    if (foto && foto.size > 0) {
      console.log('Fazendo upload da foto...');
      const fileName = `${cpf}_${Date.now()}.${foto.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, foto);

      if (uploadError) {
        console.error('Erro no upload da foto:', uploadError);
        return new Response(
          JSON.stringify({ error: 'Erro ao fazer upload da foto' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Get public URL for the uploaded photo
      const { data: publicUrlData } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);
      
      fotoUrl = publicUrlData.publicUrl;
      console.log('Foto enviada com sucesso:', fotoUrl);
    }

    // Hash da senha usando bcrypt
    console.log('Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(senha, 12);

    // Converter data de nascimento para formato ISO
    const [day, month, year] = dataNascimento.split('/');
    const dataISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    console.log('Criando usuário na base de dados...');
    
    // Criar o usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        nome,
        sobrenome,
        email,
        cpf,
        data_nascimento: dataISO,
        genero,
        celular,
        cns,
        foto: fotoUrl,
        senha_hash: senhaHash
      })
      .select()
      .single();

    if (userError) {
      console.error('Erro ao criar usuário:', userError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar usuário', details: userError.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Usuário criado:', userData.id);

    // Criar o endereço
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .insert({
        user_id: userData.id,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf
      })
      .select()
      .single();

    if (addressError) {
      console.error('Erro ao criar endereço:', addressError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar endereço', details: addressError.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Endereço criado:', addressData.id);

    // Resposta de sucesso (sem criar no Supabase Auth)
    const response = {
      id: userData.id,
      nome: userData.nome,
      sobrenome: userData.sobrenome,
      email: userData.email,
      cpf: userData.cpf,
      data_nascimento: userData.data_nascimento,
      genero: userData.genero,
      celular: userData.celular,
      foto: userData.foto,
      endereco: {
        cep: addressData.cep,
        logradouro: addressData.logradouro,
        numero: addressData.numero,
        complemento: addressData.complemento,
        bairro: addressData.bairro,
        cidade: addressData.cidade,
        uf: addressData.uf
      }
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});