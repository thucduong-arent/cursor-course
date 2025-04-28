'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'

export default function Playground() {
  const [apiKey, setApiKey] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Store the API key in localStorage for validation on the protected page
    localStorage.setItem('apiKey', apiKey)
    router.push('/protected')
  }

  const handleSummarize = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ githubUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize GitHub repository')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSidebarToggle = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={handleSidebarToggle} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-[300px]'}`}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">API Playground</h1>
            
            {/* GitHub Summarizer Form */}
            <form onSubmit={handleSummarize} className="space-y-4 mb-8">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your API key"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://github.com/username/repository"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Summarizing...' : 'Summit'}
              </button>
            </form>
            
            {/* Results Section */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {result && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h2 className="text-xl font-semibold mb-3">Repository Summary</h2>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-700">Summary</h3>
                    <p className="text-gray-600">{result.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Key Features</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      {result.keyFeatures?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Stars</h3>
                      <p className="text-gray-600">{result.stars}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">License</h3>
                      <p className="text-gray-600">{result.licenseType || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Latest Version</h3>
                      <p className="text-gray-600">{result.latestVersion || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Website</h3>
                      <p className="text-gray-600">
                        {result.websiteUrl ? (
                          <a 
                            href={result.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            {result.websiteUrl}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Raw JSON Response */}
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-2">Raw Response JSON</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto max-h-96">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 