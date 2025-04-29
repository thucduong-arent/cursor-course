"use client"

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

// Define the possible types of items that can be created
export type ItemType = 'project' | 'section' | 'task'

interface TodoCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
  type?: ItemType // Add type prop with default value
}

// Custom error type with status code
interface ApiError extends Error {
  status?: number;
}

export default function TodoCreateModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type = 'project' // Default to 'project' if not specified
}: TodoCreateModalProps) {
  const [itemName, setItemName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) return

    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(itemName)
      setItemName('')
      onClose()
    } catch (error) {
      console.error(`Error creating ${type}:`, error)
      const apiError = error as ApiError
      
      // Check status code instead of error message
      if (apiError.status === 409) {
        setError(`A ${type} with this name already exists. Please choose a different name.`)
      } else {
        setError(`Failed to create ${type}. Please try again.`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get title and description based on type
  const getTitle = () => {
    switch (type) {
      case 'project':
        return 'Create a new project'
      case 'section':
        return 'Create a new section'
      case 'task':
        return 'Create a new task'
      default:
        return 'Create a new item'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'project':
        return 'Enter a name for your new project.'
      case 'section':
        return 'Enter a name for your new section.'
      case 'task':
        return 'Enter a name for your new task.'
      default:
        return 'Enter a name for your new item.'
    }
  }

  const getLabel = () => {
    switch (type) {
      case 'project':
        return 'Project Name — A unique name to identify this project'
      case 'section':
        return 'Section Name — A name to identify this section'
      case 'task':
        return 'Task Name — A name to identify this task'
      default:
        return 'Name — A name to identify this item'
    }
  }

  const getPlaceholder = () => {
    switch (type) {
      case 'project':
        return 'Project Name'
      case 'section':
        return 'Section Name'
      case 'task':
        return 'Task Name'
      default:
        return 'Name'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">{getTitle()}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <input
                ref={inputRef}
                type="text"
                placeholder={getPlaceholder()}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg text-lg ${error ? 'border-red-500' : ''}`}
                autoComplete="off"
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg text-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!itemName.trim() || isSubmitting}
                className={`px-6 py-2 rounded-lg text-lg ${
                  itemName.trim() && !isSubmitting
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-300 text-white cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 