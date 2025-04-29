"use client"

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const [projectName, setProjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(projectName)
      setProjectName('')
      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Create a new project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter a name for your new project.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">
                Project Name — A unique name to identify this project
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border rounded-lg text-lg"
                autoComplete="off"
              />
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
                disabled={!projectName.trim() || isSubmitting}
                className={`px-6 py-2 rounded-lg text-lg ${
                  projectName.trim() && !isSubmitting
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