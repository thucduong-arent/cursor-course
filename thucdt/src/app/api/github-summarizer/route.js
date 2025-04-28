import { NextResponse } from 'next/server'
import { generateSummary } from './chain'
import { validateApiKey, checkAndIncrementApiKeyUsage } from '@/lib/apiKeyUtils'
import { getRepoInfo } from './githubUtils'

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

    // Get repository information, metadata, and README content
    const { readmeContent, stars, latestVersion, websiteUrl, licenseType } = await getRepoInfo(githubUrl)
    
    // Generate summary using the extracted function
    const summary = await generateSummary(readmeContent)

    // Return the generated summary with repository metadata
    return NextResponse.json({ 
      message: 'GitHub repository summary generated successfully',
      ...summary,
      stars,
      latestVersion,
      websiteUrl,
      licenseType
    })
  } catch (error) {
    console.error('Error processing GitHub repository summary:', error)
    return NextResponse.json(
      { error: 'Error processing GitHub repository summary' },
      { status: 500 }
    )
  }
}
