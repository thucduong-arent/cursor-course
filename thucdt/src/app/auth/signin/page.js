'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
} 