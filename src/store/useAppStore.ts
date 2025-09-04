// Store principal do app usando Zustand
import { create } from 'zustand';
import { Usuario, AppTab, LoadingState, NotificationType } from '../lib/types';
import { mockUsuario } from '../lib/stubs/data';

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
  
  // Actions
  setUsuario: (usuario: Usuario) => void;
  logout: () => void;
  setActiveTab: (tab: AppTab) => void;
  setLoadingState: (state: LoadingState) => void;
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state - com usuário mockado para desenvolvimento
  usuario: mockUsuario,
  isLoggedIn: true,
  activeTab: 'inicio',
  loadingState: 'idle',
  notification: null,
  isDarkMode: false,
  
  // Actions
  setUsuario: (usuario) => set({ usuario, isLoggedIn: true }),
  
  logout: () => set({ 
    usuario: null, 
    isLoggedIn: false,
    activeTab: 'inicio'
  }),
  
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
  }
}));

// Selector hooks para performance
export const useUsuario = () => useAppStore((state) => state.usuario);
export const useIsLoggedIn = () => useAppStore((state) => state.isLoggedIn);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useLoadingState = () => useAppStore((state) => state.loadingState);
export const useNotification = () => useAppStore((state) => state.notification);
export const useIsDarkMode = () => useAppStore((state) => state.isDarkMode);