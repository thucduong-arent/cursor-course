'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Mock API functions - replace with actual API calls
  const fetchApiKeys = async () => {
    // Replace with actual API call
    const mockKeys = [
      { id: 1, name: 'Production Key', key: 'sk_test_123', description: 'Main production API key' },
      { id: 2, name: 'Development Key', key: 'sk_test_456', description: 'Development environment key' },
    ];
    setApiKeys(mockKeys);
  };

  const createApiKey = async () => {
    // Replace with actual API call
    const newKey = {
      id: Date.now(),
      name: formData.name,
      key: `sk_test_${Math.random().toString(36).substr(2, 9)}`,
      description: formData.description,
    };
    setApiKeys([...apiKeys, newKey]);
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  const deleteApiKey = async (id) => {
    // Replace with actual API call
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">API Keys Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Key
          </button>
        </div>

        <div className="grid gap-6">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{apiKey.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{apiKey.description}</p>
                  <div className="mt-2">
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      {apiKey.key}
                    </code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingKey(apiKey);
                      setFormData({
                        name: apiKey.name,
                        description: apiKey.description,
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingKey ? 'Edit API Key' : 'Create New API Key'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingKey(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createApiKey}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {editingKey ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 