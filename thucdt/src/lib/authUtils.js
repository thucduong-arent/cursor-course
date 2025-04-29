import { supabase } from '@/lib/supabaseClient'

/**
 * Get user ID from email using Supabase
 * @param {string} email - User's email address
 * @returns {Promise<string|null>} User ID or null if not found
 */
export async function getUserIdFromEmail(email) {
  if (!email) {
    console.error('Email is required for getUserIdFromEmail')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data?.id || null
  } catch (error) {
    console.error('Unexpected error in getUserIdFromEmail:', error)
    return null
  }
} 