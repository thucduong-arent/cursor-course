/**
 * Fetches comprehensive information about a GitHub repository
 * @param {string} repositoryUrl - The GitHub repository URL
 * @returns {Promise<Object>} Repository information including metadata and README content
 */
export async function getRepoInfo(repositoryUrl) {
  try {
    // Extract owner and repo name from URL
    // Example: https://github.com/owner/repo
    const urlParts = repositoryUrl.split('github.com/')[1].split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]

    // Common headers for all requests
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }

    // Define all API requests to run in parallel
    const [
      repoResponse,
      releasesResponse,
      readmeResponse,
      licenseResponse
    ] = await Promise.all([
      // Fetch repository data
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      
      // Fetch latest release
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers })
        .catch(() => ({ ok: false })), // Handle errors gracefully
      
      // Fetch README content
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { 
        headers: { ...headers, 'Accept': 'application/vnd.github.v3.raw' } 
      }).catch(() => ({ ok: false })), // Handle errors gracefully
      
      // Fetch license information
      fetch(`https://api.github.com/repos/${owner}/${repo}/license`, { headers })
        .catch(() => ({ ok: false })) // Handle errors gracefully
    ])

    // Process repository data
    if (!repoResponse.ok) {
      throw new Error('Failed to fetch repository metadata')
    }
    const repoData = await repoResponse.json()
    
    // Process latest release data
    let latestVersion = null
    if (releasesResponse.ok) {
      const releaseData = await releasesResponse.json()
      latestVersion = releaseData.tag_name
    }
    
    // Process README content
    let readmeContent = null
    if (readmeResponse.ok) {
      readmeContent = await readmeResponse.text()
    }
    
    // Process license data
    let licenseType = null
    if (licenseResponse.ok) {
      const licenseData = await licenseResponse.json()
      licenseType = licenseData.license?.spdx_id || null
    }

    return {
      owner,
      repo,
      stars: repoData.stargazers_count,
      latestVersion,
      readmeContent,
      websiteUrl: repoData.homepage || null,
      licenseType
    }
  } catch (error) {
    console.error('Error fetching repository information:', error)
    throw new Error('Failed to get repository information')
  }
} 