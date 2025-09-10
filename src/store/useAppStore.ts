// Store principal do app usando Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario, AppTab, LoadingState, NotificationType } from '../lib/types';
import { mockUsuario } from '../lib/stubs/data';
import { supabase } from '@/integrations/supabase/client';

interface AppState {
  // User state
  usuario: Usuario | null;
  isLoggedIn: boolean;
  
  // UI state
  activeTab: AppTab;
  loadingState: LoadingState;
  
  // Notifications
  notification: {
    show: boolean;
    message: string;
    type: NotificationType;
  } | null;
  
  // Theme
  isDarkMode: boolean;
  
  // Agendamento state
  agendamento: {
    unidadeId?: string;
    equipeId?: string;
    tipoConsultaId?: string;
    profissionalId?: string;
    dataSelecionada?: string;
    horaSelecionada?: string;
  };
  
  // Actions
  setUsuario: (usuario: Usuario) => void;
  logout: () => Promise<void>; // Tornar async para incluir Supabase logout
  setActiveTab: (tab: AppTab) => void;
  setLoadingState: (state: LoadingState) => void;
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
  toggleDarkMode: () => void;
  setAgendamentoData: (data: Partial<AppState['agendamento']>) => void;
  clearAgendamento: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state - sem usuário logado por padrão
      usuario: null,
      isLoggedIn: false,
      activeTab: 'inicio',
      loadingState: 'idle',
      notification: null,
      isDarkMode: false,
      agendamento: {},
      
      // Actions
      setUsuario: (usuario) => set({ usuario, isLoggedIn: true }),
      
      logout: async () => {
        try {
          // Fazer logout do Supabase Auth
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Erro ao fazer logout do Supabase:', error);
        } finally {
          // Limpar estado local independentemente do resultado
          set({ 
            usuario: null, 
            isLoggedIn: false,
            activeTab: 'inicio'
          });
        }
      },
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setLoadingState: (state) => set({ loadingState: state }),
      
      showNotification: (message, type) => set({
        notification: { show: true, message, type }
      }),
      
      hideNotification: () => set({ notification: null }),
      
      toggleDarkMode: () => {
        const { isDarkMode } = get();
        set({ isDarkMode: !isDarkMode });
        
        // Apply theme to document
        if (!isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setAgendamentoData: (data) => set((state) => ({
        agendamento: { ...state.agendamento, ...data }
      })),
      
      clearAgendamento: () => set({ agendamento: {} })
    }),
    {
      name: 'saude-cidadao-storage', // nome único para o localStorage
      partialize: (state) => ({ 
        usuario: state.usuario, 
        isLoggedIn: state.isLoggedIn,
        isDarkMode: state.isDarkMode 
      }), // apenas persistir os dados essenciais
    }
  )
);

// Selector hooks para performance
export const useUsuario = () => useAppStore((state) => state.usuario);
export const useIsLoggedIn = () => useAppStore((state) => state.isLoggedIn);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useLoadingState = () => useAppStore((state) => state.loadingState);
export const useNotification = () => useAppStore((state) => state.notification);
export const useIsDarkMode = () => useAppStore((state) => state.isDarkMode);