import { useState, useEffect } from 'react'
import { supabase } from '../app/lib/supabaseClient'

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch API keys from Supabase
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data)
    } catch (error) {
      setError(error.message)
      console.error('Error fetching API keys:', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Create new API key
  const createApiKey = async (name, limit) => {
    try {
      const newKey = {
        name,
        value: `thuc-${generateRandomString(40)}`,
        usage: 0
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single()

      if (error) throw error

      setApiKeys([data, ...apiKeys])
      return { success: true, data }
    } catch (error) {
      console.error('Error creating API key:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error

      setApiKeys(apiKeys.filter(key => key.id !== id))
      return { success: true }
    } catch (error) {
      console.error('Error deleting API key:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Update API key
  const updateApiKey = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setApiKeys(apiKeys.map(key => key.id === id ? data : key))
      return { success: true, data }
    } catch (error) {
      console.error('Error updating API key:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Helper function to generate random string for API key
  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  useEffect(() => {
    fetchApiKeys()
  }, [])

  return {
    apiKeys,
    isLoading,
    error,
    createApiKey,
    deleteApiKey,
    updateApiKey,
    fetchApiKeys
  }
} 