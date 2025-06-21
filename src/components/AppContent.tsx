
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import DataTable from './DataTable';
import AddDataForm from './AddDataForm';
import ImportExport from './ImportExport';
import BackupData from './BackupData';
import Chat from './Chat';
import LoginCustomizer from './LoginCustomizer';
import AppCustomizer from './AppCustomizer';
import UserManagement from './UserManagement';
import { useAppData } from '@/hooks/useAppData';
import { useAppSettings } from '@/hooks/useAppSettings';

const AppContent = () => {
  const location = useLocation();
  const { 
    data, 
    handleAddData, 
    handleEditData, 
    handleDeleteData, 
    handleImportData, 
    handleUploadPDF, 
    getPDFFile 
  } = useAppData();

  const { 
    appSettings, 
    handleSettingsUpdate
  } = useAppSettings();

  // Default content component for routes that don't have specific components
  const DefaultContent = ({ title }: { title: string }) => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600">Halaman ini sedang dalam pengembangan.</p>
    </div>
  );

  return (
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<Dashboard data={data} />} />
        <Route path="/dashboard" element={<Dashboard data={data} />} />
        <Route 
          path="/data" 
          element={
            <DataTable 
              data={data} 
              onEdit={handleEditData} 
              onDelete={handleDeleteData}
              onUploadPDF={handleUploadPDF}
              getPDFFile={getPDFFile}
            />
          } 
        />
        <Route path="/add" element={<AddDataForm onAdd={handleAddData} />} />
        <Route 
          path="/import" 
          element={<ImportExport data={data} onImport={handleImportData} activeFeature="import" />} 
        />
        <Route 
          path="/export" 
          element={<ImportExport data={data} onImport={handleImportData} activeFeature="export" />} 
        />
        <Route path="/backup" element={<BackupData data={data} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login-settings" element={<LoginCustomizer />} />
        <Route path="/users" element={<UserManagement />} />
        <Route 
          path="/app-settings" 
          element={<AppCustomizer settings={appSettings} onUpdate={handleSettingsUpdate} />} 
        />
        
        {/* Routes for parent menu items */}
        <Route path="/data-management" element={<DefaultContent title="Data Management" />} />
        <Route path="/import-export" element={<DefaultContent title="Import/Export" />} />
        <Route path="/backup-system" element={<DefaultContent title="Backup System" />} />
        <Route path="/communication" element={<DefaultContent title="Communication" />} />
        <Route path="/settings" element={<DefaultContent title="Settings" />} />
        
        {/* Catch-all route for dynamically added menu items */}
        <Route path="*" element={<DefaultContent title="Halaman Tidak Ditemukan" />} />
      </Routes>
    </div>
  );
};

export default AppContent;
