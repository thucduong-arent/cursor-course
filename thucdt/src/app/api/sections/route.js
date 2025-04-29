import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabaseClient'
import { getUserIdFromEmail } from '@/lib/userUtils'

// GET all sections for the authenticated user
export async function GET(request) {
  try {
    // Get the session
    const session = await getServerSession()
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user ID from email
    const userId = await getUserIdFromEmail(session.user.email)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get project_id from query params if provided
    const url = new URL(request.url)
    const projectId = url.searchParams.get('project_id')

    // Build query
    let query = supabase
      .from('sections')
      .select('*')
      .order('created_at', { ascending: true })

    // If project_id is provided, filter by it
    if (projectId) {
      query = query.eq('project_id', projectId)
    } else {
      // Otherwise, get sections from all user's projects
      const { data: userProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', userId)

      if (projectsError) {
        console.error('Error fetching user projects:', projectsError)
        return NextResponse.json(
          { error: 'Failed to fetch user projects' },
          { status: 500 }
        )
      }

      const projectIds = userProjects.map(project => project.id)
      query = query.in('project_id', projectIds)
    }

    // Execute query
    const { data, error } = await query

    if (error) {
      console.error('Error fetching sections:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sections' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sections: data })
  } catch (error) {
    console.error('Error in GET /api/sections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST to create a new section
export async function POST(request) {
  try {
    // Get the session
    const session = await getServerSession()
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user ID from email
    const userId = await getUserIdFromEmail(session.user.email)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, project_id } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Section name is required' },
        { status: 400 }
      )
    }

    if (!project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify that the project belongs to the user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', userId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Create new section
    const { data, error } = await supabase
      .from('sections')
      .insert([
        {
          name,
          project_id
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating section:', error)
      return NextResponse.json(
        { error: 'Failed to create section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, section: data })
  } catch (error) {
    console.error('Error in POST /api/sections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 