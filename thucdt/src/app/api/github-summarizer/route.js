import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import { generateSummary } from './chain'

export async function POST(req) {
  try {
    const { githubUrl } = await req.json()
    
    // Get API key from request header
    const apiKey = req.headers.get('x-api-key')

    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // Check if API key is valid
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('value', apiKey)
      .single()

    if (keyError || !keyData) {
      return NextResponse.json(
        { message: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Validate repository URL
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      )
    }

    const readmeContent = await getReadmeContent(githubUrl)
    
    // Generate summary using the extracted function
    const summary = await generateSummary(readmeContent)

    // Return the generated summary
    return NextResponse.json({ 
      message: 'GitHub repository summary generated successfully',
      ...summary
    })
  } catch (error) {
    console.error('Error processing GitHub repository summary:', error)
    return NextResponse.json(
      { error: 'Error processing GitHub repository summary' },
      { status: 500 }
    )
  }
} 

async function getReadmeContent(repositoryUrl) {
  try {
    // Extract owner and repo name from URL
    // Example: https://github.com/owner/repo
    const urlParts = repositoryUrl.split('github.com/')[1].split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]

    // Fetch README content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch README')
    }

    const readmeContent = await response.text()
    return readmeContent

  } catch (error) {
    throw new Error('Failed to get repository README content')
  }
}
