'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Notification from '../components/Notification'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with project URL and anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Protected() {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('success')
  const router = useRouter()

  useEffect(() => {
    const validateApiKey = async () => {
      const apiKey = localStorage.getItem('apiKey')
      
      if (!apiKey) {
        setNotificationMessage('No API key provided')
        setNotificationType('error')
        setShowNotification(true)
        setTimeout(() => {
          router.push('/playground')
        }, 2000)
        return
      }

      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('id')
          .eq('value', apiKey)
          .single()
        
        if (error) {
          setNotificationMessage('Invalid API key')
          setNotificationType('error')
          setTimeout(() => {
            router.push('/playground')
          }, 2000)
        } else if (!data) {
          setNotificationMessage('Invalid API key')
          setNotificationType('error')
          setTimeout(() => {
            router.push('/playground')
          }, 2000)
        } else {
          setNotificationMessage('Valid API key, /protected can be accessed')
          setNotificationType('success')
        }
      } catch (error) {
        setNotificationMessage('Error validating API key')
        setNotificationType('error')
        setTimeout(() => {
          router.push('/playground')
        }, 2000)
      }
      
      setShowNotification(true)
    }

    validateApiKey()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Protected Page</h1>
        <p className="text-center text-gray-600">
          This is a protected page that requires a valid API key to access.
        </p>
      </div>
      
      <Notification
        message={notificationMessage}
        type={notificationType}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  )
} 