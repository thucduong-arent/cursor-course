import { useState } from 'react'
import ApiKeyTable from './ApiKeyTable'
import ApiKeyModal from './ApiKeyModal'

export default function ApiKeysSection({ 
  apiKeys, 
  isLoading, 
  error, 
  onDelete, 
  onUpdate, 
  onCreate, 
  showNotification 
}) {
  const [showModal, setShowModal] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [formData, setFormData] = useState({
    name: ''
  })

  const handleEdit = (apiKey) => {
    setEditingKey(apiKey)
    setFormData({
      name: apiKey.name
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (editingKey) {
      const result = await onUpdate(editingKey.id, { name: formData.name })
      if (result.success) {
        setShowModal(false)
        setEditingKey(null)
        setFormData({ name: '' })
      }
    } else {
      const result = await onCreate(formData.name)
      if (result.success) {
        setShowModal(false)
        setFormData({ name: '' })
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingKey(null)
    setFormData({ name: '' })
  }

  return (
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
        <ApiKeyTable 
          apiKeys={apiKeys} 
          onDelete={onDelete} 
          onEdit={handleEdit} 
          showNotification={showNotification} 
        />
      )}

      {/* Modal for Creating/Editing API Keys */}
      <ApiKeyModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingKey={editingKey}
        isSidebarCollapsed={false}
      />
    </div>
  )
} 