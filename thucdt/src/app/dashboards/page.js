'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    limit: '1000',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API keys from Supabase
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching API keys:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async () => {
    try {
      const newKey = {
        name: formData.name,
        value: `thuc-${generateRandomString(40)}`,
        usage: 0,
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;

      setApiKeys([data, ...apiKeys]);
      setShowModal(false);
      setFormData({ name: '', limit: '1000' });
    } catch (error) {
      console.error('Error creating API key:', error.message);
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error.message);
    }
  };

  // Update API key
  const updateApiKey = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setApiKeys(apiKeys.map(key => key.id === id ? data : key));
    } catch (error) {
      console.error('Error updating API key:', error.message);
    }
  };

  // Helper function to generate random string for API key
  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
        <nav className="space-y-4">
          <a href="#" className="block text-lg font-semibold">Overview</a>
          <a href="#" className="block text-lg">Research Assistant</a>
          <a href="#" className="block text-lg">Research Reports</a>
          <a href="#" className="block text-lg">API Playground</a>
          <a href="#" className="block text-lg">Invoices</a>
          <a href="#" className="block text-lg">Documentation</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-left">Overview</h1>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-lg mt-4 text-left">
            <h2 className="text-xl">Researcher</h2>
            <p>API Limit: 24/1,000 Requests</p>
          </div>
        </header>

        {/* API Keys Management */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-left">API Keys</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Create New Key
            </button>
          </div>

          {/* API Keys Table */}
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="py-2 text-left">NAME</th>
                  <th className="py-2 text-left">USAGE</th>
                  <th className="py-2 text-left">KEY</th>
                  <th className="py-2 text-left">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-t">
                    <td className="py-2">{apiKey.name}</td>
                    <td className="py-2">{apiKey.usage}</td>
                    <td className="py-2 font-mono">
                      {visibleKeys.has(apiKey.id) ? apiKey.value : 'thuc-****************************************'}
                    </td>
                    <td className="py-2 flex gap-2">
                      <button 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className={`p-2 text-gray-600 hover:text-blue-500 rounded ${visibleKeys.has(apiKey.id) ? 'text-blue-500' : ''}`}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-500 rounded">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setEditingKey(apiKey);
                          setFormData({
                            name: apiKey.name,
                            limit: apiKey.limit?.toString() || '1000',
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-500 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-2 text-gray-600 hover:text-red-500 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Modal for Creating/Editing API Keys */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold mb-2">
                  {editingKey ? 'Edit API Key' : 'Create a new API key'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {editingKey ? 'Update the name of your API key.' : 'Enter a name and limit for the new API key.'}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg mb-2">
                      Key Name — A unique name to identify this key
                    </label>
                    <input
                      type="text"
                      placeholder="Key Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border rounded-lg text-lg"
                    />
                  </div>
                  {!editingKey && (
                    <div>
                      <label className="block text-lg mb-2">
                        Limit monthly usage*
                      </label>
                      <input
                        type="number"
                        placeholder="1000"
                        value={formData.limit || '1000'}
                        onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                        className="w-full p-3 border rounded-lg text-lg"
                      />
                      <p className="text-gray-500 mt-2 text-sm">
                        * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingKey(null);
                        setFormData({ name: '', limit: '1000' });
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg text-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (editingKey) {
                          await updateApiKey(editingKey.id, { name: formData.name });
                          setShowModal(false);
                          setEditingKey(null);
                          setFormData({ name: '', limit: '1000' });
                        } else {
                          createApiKey();
                        }
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
                    >
                      {editingKey ? 'Save Changes' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 