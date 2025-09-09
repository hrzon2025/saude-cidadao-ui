import { useState, useCallback } from 'react';

interface NotificationItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  duracao?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (notification: Omit<NotificationItem, 'id'>) => {
      const id = Date.now().toString();
      const newNotification = { ...notification, id };
      
      setNotifications(prev => [...prev, newNotification]);
      
      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper functions for different types of notifications
  const showSuccess = useCallback(
    (titulo: string, descricao: string, duracao?: number) => {
      return addNotification({ titulo, descricao, tipo: 'success', duracao });
    },
    [addNotification]
  );

  const showError = useCallback(
    (titulo: string, descricao: string, duracao?: number) => {
      return addNotification({ titulo, descricao, tipo: 'error', duracao });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (titulo: string, descricao: string, duracao?: number) => {
      return addNotification({ titulo, descricao, tipo: 'warning', duracao });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (titulo: string, descricao: string, duracao?: number) => {
      return addNotification({ titulo, descricao, tipo: 'info', duracao });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}