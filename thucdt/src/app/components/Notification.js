'use client'

import { useEffect } from 'react'

export default function Notification({ message, onClose, isVisible, type = 'success' }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500'

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg animate-fade-in`}>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        {type === 'error' ? (
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M20 6L9 17L4 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:text-gray-200"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
