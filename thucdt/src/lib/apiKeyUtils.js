import { supabase } from '@/lib/supabaseClient'

/**
 * Checks if an API key is valid and within its usage limit
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<{isValid: boolean, isLimited: boolean, keyData: Object|null, error: string|null}>}
 */
export async function checkApiKeyLimit(apiKey) {
  try {
    // Check if API key is valid and get its details
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, usage, limit')
      .eq('value', apiKey)
      .single()

    if (keyError || !keyData) {
      return {
        isValid: false,
        isLimited: false,
        keyData: null,
        error: 'Invalid API key'
      }
    }

    // Check rate limit
    if (keyData.limit !== null && keyData.usage >= keyData.limit) {
      return {
        isValid: true,
        isLimited: true,
        keyData,
        error: 'Rate limit exceeded'
      }
    }

    // API key is valid and within limits
    return {
      isValid: true,
      isLimited: false,
      keyData,
      error: null
    }
  } catch (error) {
    console.error('Error checking API key limit:', error)
    return {
      isValid: false,
      isLimited: false,
      keyData: null,
      error: 'Error checking API key limit'
    }
  }
}

/**
 * Increments the usage counter for an API key
 * @param {string} keyId - The ID of the API key
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function incrementApiKeyUsage(keyId) {
  try {
    // Get current usage
    const { data: keyData, error: fetchError } = await supabase
      .from('api_keys')
      .select('usage')
      .eq('id', keyId)
      .single()

    if (fetchError || !keyData) {
      return {
        success: false,
        error: 'Error fetching API key usage'
      }
    }

    // Increment usage counter
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: keyData.usage + 1 })
      .eq('id', keyId)

    if (updateError) {
      console.error('Error updating API key usage:', updateError)
      return {
        success: false,
        error: 'Error updating API key usage'
      }
    }

    return {
      success: true,
      error: null
    }
  } catch (error) {
    console.error('Error incrementing API key usage:', error)
    return {
      success: false,
      error: 'Error incrementing API key usage'
    }
  }
}

/**
 * Validates if an API key exists and is valid
 * @param {Request} req - The Next.js request object
 * @returns {Promise<{isValid: boolean, keyData: Object|null, error: string|null}>}
 */
export async function validateApiKey(req) {
  // Get API key from request header
  const apiKey = req.headers.get('x-api-key')

  // Validate API key
  if (!apiKey) {
    return {
      isValid: false,
      keyData: null,
      error: 'API key is required'
    }
  }

  try {
    // Check if API key exists
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('value', apiKey)
      .maybeSingle()

    if (keyError || !keyData) {
      return {
        isValid: false,
        keyData: null,
        error: 'Invalid API key'
      }
    }

    // API key is valid
    return {
      isValid: true,
      keyData,
      error: null
    }
  } catch (error) {
    console.error('Error validating API key:', error)
    return {
      isValid: false,
      keyData: null,
      error: 'Error validating API key'
    }
  }
}

/**
 * Checks if an API key has exceeded its usage limit and increments the counter if not
 * @param {string} apiKey - The API key to check
 * @returns {Promise<{isLimited: boolean, keyData: Object|null, error: string|null}>}
 */
export async function checkAndIncrementApiKeyUsage(apiKey) {
  try {
    // Check if API key is valid and get its details
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, usage, limit')
      .eq('value', apiKey)
      .single()

    if (keyError || !keyData) {
      return {
        isLimited: false,
        keyData: null,
        error: 'Invalid API key'
      }
    }

    // Check rate limit
    if (keyData.limit !== null && keyData.usage >= keyData.limit) {
      return {
        isLimited: true,
        keyData,
        error: 'Rate limit exceeded'
      }
    }

    // Increment usage counter
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: keyData.usage + 1 })
      .eq('id', keyData.id)

    if (updateError) {
      console.error('Error updating API key usage:', updateError)
      return {
        isLimited: false,
        keyData,
        error: 'Error updating API key usage'
      }
    }

    // API key is valid, within limits, and usage has been incremented
    return {
      isLimited: false,
      keyData,
      error: null
    }
  } catch (error) {
    console.error('Error checking and incrementing API key usage:', error)
    return {
      isLimited: false,
      keyData: null,
      error: 'Error checking and incrementing API key usage'
    }
  }
} 