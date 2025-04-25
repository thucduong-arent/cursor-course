import { useRef, useEffect } from 'react'

export default function ApiKeyModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  editingKey,
  isSidebarCollapsed
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.name.trim()) {
      e.preventDefault()
      onSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'invisible' : 'visible'}`}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
          <h2 className="text-2xl font-bold mb-2">
            {editingKey ? 'Edit API Key' : 'Create a new API key'}
          </h2>
          <p className="text-gray-600 mb-6">
            {editingKey ? 'Update the name of your API key.' : 'Enter a name for the new API key.'}
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">
                Key Name — A unique name to identify this key
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Key Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border rounded-lg text-lg"
              />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg text-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!formData.name.trim()}
                className={`px-6 py-2 rounded-lg text-lg ${
                  formData.name.trim() 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-300 text-white cursor-not-allowed'
                }`}
              >
                {editingKey ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 