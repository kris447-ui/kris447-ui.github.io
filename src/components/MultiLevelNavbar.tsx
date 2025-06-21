import React, { useState } from 'react';
import { BarChart3, Database, Plus, Upload, Download, Users, LogOut, ChevronDown, Settings, Archive, MessageSquare, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import AppCustomizer from './AppCustomizer';
import HierarchicalMenuEditor from './HierarchicalMenuEditor';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  editable?: boolean;
  children?: MenuItem[];
  order?: number;
  parentId?: string;
}

interface MultiLevelNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  customSettings?: {
    appTitle: string;
    primaryColor: string;
    navbarStyle: string;
    menuItems: MenuItem[];
  };
  onSettingsUpdate?: (settings: any) => void;
  onUpdateMenuItem?: (id: string, label: string, icon: string) => void;
  onAddMenuItem?: (newItem: { id: string; label: string; icon: string }) => void;
  onRemoveMenuItem?: (id: string) => void;
}

const MultiLevelNavbar = ({ 
  activeTab, 
  setActiveTab, 
  customSettings, 
  onSettingsUpdate,
  onUpdateMenuItem,
  onAddMenuItem,
  onRemoveMenuItem
}: MultiLevelNavbarProps) => {
  const { user, logout } = useAuth();

  const defaultMenuStructure: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', order: 1 },
    {
      id: 'data-management',
      label: 'Data Management',
      icon: 'Database',
      order: 2,
      children: [
        { id: 'data', label: 'View Data', icon: 'Database', order: 1, parentId: 'data-management' },
        { id: 'add', label: 'Tambah Data', icon: 'Plus', order: 2, parentId: 'data-management' }
      ]
    },
    {
      id: 'import-export',
      label: 'Import/Export',
      icon: 'Upload',
      order: 3,
      children: [
        { id: 'import', label: 'Import Data', icon: 'Upload', order: 1, parentId: 'import-export' },
        { id: 'export', label: 'Export Data', icon: 'Download', order: 2, parentId: 'import-export' }
      ]
    },
    {
      id: 'backup-system',
      label: 'Backup System',
      icon: 'Archive',
      order: 4,
      children: [
        { id: 'backup', label: 'Backup Data', icon: 'Archive', order: 1, parentId: 'backup-system' }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: 'MessageSquare',
      order: 5,
      children: [
        { id: 'chat', label: 'Chat System', icon: 'MessageSquare', order: 1, parentId: 'communication' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      order: 6,
      children: [
        { id: 'login-settings', label: 'Login Customization', icon: 'Palette', order: 1, parentId: 'settings' },
        { id: 'app-settings', label: 'App Settings', icon: 'Settings', order: 3, parentId: 'settings' }
      ]
    }
  ];

  // Add User Management for Administrator only
  const menuStructure = [...defaultMenuStructure];
  if (user?.role === 'Administrator') {
    const settingsMenu = menuStructure.find(item => item.id === 'settings');
    if (settingsMenu && settingsMenu.children) {
      settingsMenu.children.splice(1, 0, { 
        id: 'users', 
        label: 'User Management', 
        icon: 'Users', 
        order: 2, 
        parentId: 'settings' 
      });
    }
  }

  // Use custom menu structure if provided, otherwise use default
  let currentMenuStructure = customSettings?.menuItems && customSettings.menuItems.length > 0 
    ? buildHierarchicalMenu(customSettings.menuItems)
    : menuStructure;

  // Filter out User Management if user is not Administrator
  if (user?.role !== 'Administrator') {
    currentMenuStructure = filterUserManagement(currentMenuStructure);
  }

  const settings = customSettings || {
    appTitle: 'Sistem Manajemen Data',
    primaryColor: 'blue',
    navbarStyle: 'default',
    menuItems: []
  };

  // Filter out User Management menu for non-administrators
  function filterUserManagement(menuItems: MenuItem[]): MenuItem[] {
    return menuItems.map(item => ({
      ...item,
      children: item.children ? item.children.filter(child => child.id !== 'users') : undefined
    }));
  }

  // Build hierarchical menu from flat structure
  function buildHierarchicalMenu(flatItems: MenuItem[]): MenuItem[] {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    // Create a map of all items
    flatItems.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Build the hierarchy
    flatItems.forEach(item => {
      const menuItem = itemMap.get(item.id)!;
      
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(menuItem);
      } else {
        rootItems.push(menuItem);
      }
    });

    // Sort items by order
    const sortByOrder = (items: MenuItem[]) => {
      return items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => ({
        ...item,
        children: item.children ? sortByOrder(item.children) : undefined
      }));
    };

    return sortByOrder(rootItems);
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      BarChart3, Database, Plus, Upload, Download, Users, Settings, Archive, MessageSquare, Palette
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

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (activeTab === item.id) return true;
    if (item.children) {
      return item.children.some(child => isMenuItemActive(child));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = getIconComponent(item.icon);

    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={getButtonVariant(isMenuItemActive(item))}
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-white border shadow-lg z-50"
            side="bottom"
            align="start"
          >
            {item.children.map((child) => renderDropdownItem(child))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <Button
          key={item.id}
          variant={getButtonVariant(activeTab === item.id)}
          onClick={() => {
            console.log('Menu clicked:', item.id);
            setActiveTab(item.id);
          }}
          className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Button>
      );
    }
  };

  const renderDropdownItem = (item: MenuItem) => {
    const Icon = getIconComponent(item.icon);

    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <DropdownMenuItem className="flex items-center justify-between cursor-pointer hover:bg-gray-100">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            </DropdownMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-white border shadow-lg z-50"
            side="right"
            align="start"
          >
            {item.children.map((child) => renderDropdownItem(child))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <DropdownMenuItem
          key={item.id}
          onClick={() => {
            console.log('Dropdown menu clicked:', item.id);
            setActiveTab(item.id);
          }}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100"
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </DropdownMenuItem>
      );
    }
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
            
            <div className="hidden md:flex items-center space-x-1">
              {currentMenuStructure.map(renderMenuItem)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {onUpdateMenuItem && onAddMenuItem && onRemoveMenuItem && (
              <HierarchicalMenuEditor
                menuItems={settings.menuItems}
                onUpdateMenuItem={onUpdateMenuItem}
                onAddMenuItem={onAddMenuItem}
                onRemoveMenuItem={onRemoveMenuItem}
                onUpdateMenuStructure={onSettingsUpdate}
              />
            )}
            {onSettingsUpdate && (
              <AppCustomizer 
                settings={{
                  appTitle: settings.appTitle,
                  primaryColor: settings.primaryColor,
                  backgroundColor: 'white',
                  navbarStyle: settings.navbarStyle,
                  menuItems: settings.menuItems
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

export default MultiLevelNavbar;
