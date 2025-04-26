'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          {error === 'AccessDenied' && 'You do not have permission to sign in.'}
          {error === 'Verification' && 'The verification link may have expired or already been used.'}
          {error === 'Configuration' && 'There is a problem with the server configuration.'}
          {!error && 'An error occurred during authentication.'}
        </p>
        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
} 