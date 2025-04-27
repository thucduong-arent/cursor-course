'use client';

import { useState, useEffect } from 'react';
import { useApiKeys } from '../../hooks/useApiKeys';
import Notification from '../components/Notification';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';
import ApiKeysSection from '../../components/ApiKeysSection';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const { 
    apiKeys, 
    isLoading, 
    error, 
    createApiKey, 
    deleteApiKey, 
    updateApiKey 
  } = useApiKeys();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - hidden on mobile when collapsed */}
      <div className={`${isSidebarCollapsed && isMobile ? 'hidden' : 'block'} md:block`}>
        <Sidebar onToggle={setIsSidebarCollapsed} />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 p-4 md:p-8 ${!isSidebarCollapsed && !isMobile ? 'md:ml-[300px]' : ''}`}>
        {/* Header */}
        <DashboardHeader />

        {/* API Keys Management */}
        <div className="mt-6">
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
        </div>

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