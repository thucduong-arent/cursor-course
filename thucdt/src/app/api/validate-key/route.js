import { supabase } from '../../lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { apiKey } = await req.json()

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is required' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('value', apiKey)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { message: 'Invalid API key' },
        { status: 401 }
      )
    }

    return NextResponse.json({ message: 'Valid API key' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error validating API key' },
      { status: 500 }
    )
  }
} 