
import { useState } from 'react';
import { AppSettings } from '@/types/app';

export const useAppSettings = () => {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appTitle: 'Sistem Manajemen Data',
    primaryColor: 'blue',
    backgroundColor: 'white',
    navbarStyle: 'default',
    menuItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', editable: true, order: 1 },
      { id: 'data-management', label: 'Data Management', icon: 'Database', editable: true, order: 2 },
      { id: 'data', label: 'View Data', icon: 'Database', editable: true, order: 1, parentId: 'data-management' },
      { id: 'add', label: 'Tambah Data', icon: 'Plus', editable: true, order: 2, parentId: 'data-management' },
      { id: 'import-export', label: 'Import/Export', icon: 'Upload', editable: true, order: 3 },
      { id: 'import', label: 'Import Data', icon: 'Upload', editable: true, order: 1, parentId: 'import-export' },
      { id: 'export', label: 'Export Data', icon: 'Download', editable: true, order: 2, parentId: 'import-export' },
      { id: 'backup-system', label: 'Backup System', icon: 'Archive', editable: true, order: 4 },
      { id: 'backup', label: 'Backup Data', icon: 'Archive', editable: true, order: 1, parentId: 'backup-system' },
      { id: 'communication', label: 'Communication', icon: 'MessageSquare', editable: true, order: 5 },
      { id: 'chat', label: 'Chat System', icon: 'MessageSquare', editable: true, order: 1, parentId: 'communication' },
      { id: 'settings', label: 'Settings', icon: 'Settings', editable: true, order: 6 },
      { id: 'login-settings', label: 'Login Customization', icon: 'Palette', editable: true, order: 1, parentId: 'settings' },
      { id: 'users', label: 'User Management', icon: 'Users', editable: true, order: 2, parentId: 'settings' },
      { id: 'app-settings', label: 'App Settings', icon: 'Settings', editable: true, order: 3, parentId: 'settings' },
    ]
  });

  const handleSettingsUpdate = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
  };

  const updateMenuItem = (id: string, label: string, icon: string) => {
    setAppSettings(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item => 
        item.id === id ? { ...item, label, icon } : item
      )
    }));
  };

  const addMenuItem = (newItem: { id: string; label: string; icon: string; parentId?: string; order?: number }) => {
    setAppSettings(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, { ...newItem, editable: true }]
    }));
  };

  const removeMenuItem = (id: string) => {
    setAppSettings(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id && item.parentId !== id)
    }));
  };

  const getBackgroundClass = () => {
    return `min-h-screen bg-${appSettings.backgroundColor}`;
  };

  return {
    appSettings,
    handleSettingsUpdate,
    updateMenuItem,
    addMenuItem,
    removeMenuItem,
    getBackgroundClass
  };
};
