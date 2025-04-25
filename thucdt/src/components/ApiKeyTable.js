import { useState } from 'react'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function ApiKeyTable({ 
  apiKeys, 
  onDelete, 
  onEdit, 
  onCopy, 
  showNotification 
}) {
  const [visibleKeys, setVisibleKeys] = useState(new Set())

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
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
                <EyeIcon className="h-5 w-5" strokeWidth={2} />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(apiKey.value)
                  showNotification('Copied API Key to clipboard')
                }}
                className="p-2 text-gray-600 hover:text-blue-500 rounded"
                title="Copy API Key"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(apiKey)}
                className="p-2 text-gray-600 hover:text-blue-500 rounded"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(apiKey.id)}
                className="p-2 text-gray-600 hover:text-red-500 rounded"
              >
                <TrashIcon className="h-5 w-5" strokeWidth={2} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
} 