'use client';

import { useState } from 'react';
import { useApiKeys } from '../../hooks/useApiKeys';
import Notification from '../components/Notification';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';
import ApiKeysSection from '../../components/ApiKeysSection';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const { 
    apiKeys, 
    isLoading, 
    error, 
    createApiKey, 
    deleteApiKey, 
    updateApiKey 
  } = useApiKeys();

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onToggle={setIsSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-[300px]'} p-8`}>
        {/* Header */}
        <DashboardHeader />

        {/* API Keys Management */}
        <ApiKeysSection 
          apiKeys={apiKeys}
          isLoading={isLoading}
          error={error}
          onDelete={async (id) => {
            const result = await deleteApiKey(id);
            if (result.success) {
              showNotification('API Key deleted successfully', 'error');
            }
          }}
          onUpdate={async (id, updates) => {
            const result = await updateApiKey(id, updates);
            if (result.success) {
              showNotification('API Key updated successfully');
            }
            return result;
          }}
          onCreate={async (name) => {
            const result = await createApiKey(name);
            if (result.success) {
              showNotification('API Key created successfully');
            }
            return result;
          }}
          showNotification={showNotification}
        />

        <Notification 
          message={notification.message}
          isVisible={notification.show}
          onClose={() => setNotification({ show: false, message: '', type: 'success' })}
          type={notification.type}
        />
      </div>
    </div>
  );
} 