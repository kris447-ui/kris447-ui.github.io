
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MultiLevelNavbar from './MultiLevelNavbar';
import AppContent from './AppContent';
import Login from './Login';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/hooks/useAppSettings';

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { 
    appSettings, 
    handleSettingsUpdate, 
    updateMenuItem, 
    addMenuItem, 
    removeMenuItem,
    getBackgroundClass 
  } = useAppSettings();

  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.substring(1); // Remove leading slash
  };

  const activeTab = getCurrentTab();

  const setActiveTab = (tab: string) => {
    console.log('Setting active tab to:', tab);
    if (tab === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  // Show login page if user is not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className={getBackgroundClass()}>
      <MultiLevelNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customSettings={appSettings}
        onSettingsUpdate={handleSettingsUpdate}
        onUpdateMenuItem={updateMenuItem}
        onAddMenuItem={addMenuItem}
        onRemoveMenuItem={removeMenuItem}
      />
      <AppContent />
    </div>
  );
};

export default MainApp;
