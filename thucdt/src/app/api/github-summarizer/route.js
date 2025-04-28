import { NextResponse } from 'next/server'
import { generateSummary } from './chain'
import { validateApiKey, checkAndIncrementApiKeyUsage } from '@/lib/apiKeyUtils'

export async function POST(req) {
  try {
    const { githubUrl } = await req.json()
    
    // First, validate if the API key exists
    const { isValid, keyData: validationData, error: validationError } = await validateApiKey(req)
    
    if (!isValid) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }
    
    // Then, check if the API key has exceeded its limit and increment usage
    const { isLimited, keyData, error: limitError } = await checkAndIncrementApiKeyUsage(req.headers.get('x-api-key'))
    
    if (isLimited) {
      return NextResponse.json(
        { error: limitError },
        { status: 429 }
      )
    }
    
    if (limitError) {
      console.error('Error checking API key limit:', limitError)
      return NextResponse.json(
        { error: 'Error checking API key limit' },
        { status: 500 }
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
