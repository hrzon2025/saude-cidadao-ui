import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUsuario, logout: logoutStore } = useAppStore();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // User signed in or token refreshed - fetch user profile data
          setTimeout(async () => {
            try {
              const { data: usuarioData } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', session.user.email)
                .single();

              if (usuarioData) {
                // Buscar endereço do usuário
                const { data: enderecoData } = await supabase
                  .from('enderecos')
                  .select('*')
                  .eq('usuario_id', usuarioData.id)
                  .maybeSingle();

                // Salvar dados do usuário no store
                setUsuario({
                  id: usuarioData.id,
                  nome: `${usuarioData.nome} ${usuarioData.sobrenome}`,
                  cpf: usuarioData.cpf,
                  dataNascimento: usuarioData.data_nascimento,
                  email: usuarioData.email,
                  telefone: usuarioData.celular,
                  endereco: enderecoData ? `${enderecoData.logradouro}, ${enderecoData.numero} - ${enderecoData.bairro}, ${enderecoData.cidade}/${enderecoData.uf}` : "",
                  avatarUrl: usuarioData.avatar_url || "",
                  cns: usuarioData.cns || "",
                  preferencias: {
                    notificacoes: true,
                    biometria: false
                  }
                });
              }
            } catch (error) {
              console.error('Erro ao buscar dados do usuário:', error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          // User signed out - clear app store
          setTimeout(() => {
            logoutStore();
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Auto-load user data if session exists
        setTimeout(async () => {
          try {
            const { data: usuarioData } = await supabase
              .from('usuarios')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (usuarioData) {
              // Buscar endereço do usuário
              const { data: enderecoData } = await supabase
                .from('enderecos')
                .select('*')
                .eq('usuario_id', usuarioData.id)
                .maybeSingle();

              // Salvar dados do usuário no store
              setUsuario({
                id: usuarioData.id,
                nome: `${usuarioData.nome} ${usuarioData.sobrenome}`,
                cpf: usuarioData.cpf,
                dataNascimento: usuarioData.data_nascimento,
                email: usuarioData.email,
                telefone: usuarioData.celular,
                endereco: enderecoData ? `${enderecoData.logradouro}, ${enderecoData.numero} - ${enderecoData.bairro}, ${enderecoData.cidade}/${enderecoData.uf}` : "",
                avatarUrl: usuarioData.avatar_url || "",
                cns: usuarioData.cns || "",
                preferencias: {
                  notificacoes: true,
                  biometria: false
                }
              });
            }
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUsuario, logoutStore]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}