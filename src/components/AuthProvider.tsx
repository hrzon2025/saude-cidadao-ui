import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state management
  useAuth();
  
  return <>{children}</>;
}