'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Notification from '../components/Notification';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';
import ApiKeysSection from '../../components/ApiKeysSection';

export default function Dashboard() {
  const { data: session } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/api-keys');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data.apiKeys);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching API keys:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async (name, limit) => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, limit }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create API key');
      }
      
      const { data } = await response.json();
      setApiKeys([data, ...apiKeys]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating API key:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete API key');
      }
      
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting API key:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Update API key
  const updateApiKey = async (id, updates) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update API key');
      }
      
      const { data } = await response.json();
      setApiKeys(apiKeys.map(key => key.id === id ? data : key));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating API key:', error.message);
      return { success: false, error: error.message };
    }
  };

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

  // Fetch API keys when session is available
  useEffect(() => {
    if (session) {
      fetchApiKeys();
    }
  }, [session]);

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