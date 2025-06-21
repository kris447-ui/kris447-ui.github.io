
import React from 'react';
import { BarChart3, Database, Plus, Upload, Download, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AppCustomizer from './AppCustomizer';
import MenuEditor from './MenuEditor';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  customSettings?: {
    appTitle: string;
    primaryColor: string;
    navbarStyle: string;
    menuItems: Array<{
      id: string;
      label: string;
      icon: string;
      editable?: boolean;
    }>;
  };
  onSettingsUpdate?: (settings: any) => void;
  onUpdateMenuItem?: (id: string, label: string, icon: string) => void;
  onAddMenuItem?: (newItem: { id: string; label: string; icon: string }) => void;
  onRemoveMenuItem?: (id: string) => void;
}

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  customSettings, 
  onSettingsUpdate,
  onUpdateMenuItem,
  onAddMenuItem,
  onRemoveMenuItem
}: NavbarProps) => {
  const { user, logout } = useAuth();

  const defaultSettings = {
    appTitle: 'Sistem Manajemen Data',
    primaryColor: 'blue',
    navbarStyle: 'default',
    menuItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
      { id: 'data', label: 'Data Management', icon: 'Database' },
      { id: 'add', label: 'Tambah Data', icon: 'Plus' },
      { id: 'import', label: 'Import', icon: 'Upload' },
      { id: 'export', label: 'Export', icon: 'Download' },
    ]
  };

  const settings = customSettings || defaultSettings;

  // Add User Management for Administrator only
  const menuItems = [...settings.menuItems];
  if (user?.role === 'Administrator') {
    menuItems.push({ id: 'users', label: 'User Management', icon: 'Users' });
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      BarChart3,
      Database,
      Plus,
      Upload,
      Download,
      Users
    };
    return iconMap[iconName] || BarChart3;
  };

  const getNavbarClasses = () => {
    const baseClasses = "shadow-sm border-b transition-all duration-200";
    
    switch (settings.navbarStyle) {
      case 'dark':
        return `${baseClasses} bg-gray-900 text-white`;
      case 'colored':
        return `${baseClasses} bg-${settings.primaryColor}-600 text-white`;
      case 'transparent':
        return `${baseClasses} bg-white/80 backdrop-blur-sm`;
      default:
        return `${baseClasses} bg-white`;
    }
  };

  const getButtonVariant = (isActive: boolean) => {
    if (settings.navbarStyle === 'dark' || settings.navbarStyle === 'colored') {
      return isActive ? "secondary" : "ghost";
    }
    return isActive ? "default" : "ghost";
  };

  return (
    <nav className={getNavbarClasses()}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className={`text-xl font-bold ${
              settings.navbarStyle === 'dark' || settings.navbarStyle === 'colored' 
                ? 'text-white' 
                : `text-${settings.primaryColor}-600`
            }`}>
              {settings.appTitle}
            </h1>
            
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <Button
                    key={item.id}
                    variant={getButtonVariant(activeTab === item.id)}
                    onClick={() => setActiveTab(item.id)}
                    className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {onUpdateMenuItem && onAddMenuItem && onRemoveMenuItem && (
              <MenuEditor
                menuItems={menuItems}
                onUpdateMenuItem={onUpdateMenuItem}
                onAddMenuItem={onAddMenuItem}
                onRemoveMenuItem={onRemoveMenuItem}
              />
            )}
            {onSettingsUpdate && (
              <AppCustomizer 
                settings={{
                  ...defaultSettings,
                  ...settings,
                  backgroundColor: 'white'
                }} 
                onUpdate={onSettingsUpdate} 
              />
            )}
            <span className={`text-sm ${
              settings.navbarStyle === 'dark' || settings.navbarStyle === 'colored'
                ? 'text-gray-200'
                : 'text-muted-foreground'
            }`}>
              {user?.username} ({user?.role})
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
