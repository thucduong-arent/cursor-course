import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabaseClient'
import { getUserIdFromEmail } from '@/lib/authUtils'

// GET a specific section
export async function GET(request, context) {
  try {
    const { params } = context
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

    const { id } = params

    // Fetch the specific section
    const { data, error } = await supabase
      .from('sections')
      .select('*, projects!inner(*)')
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching section:', error)
      return NextResponse.json(
        { error: 'Failed to fetch section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ section: data })
  } catch (error) {
    console.error('Error in GET /api/sections/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT to update a section
export async function PUT(request, context) {
  try {
    const { params } = context
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

    const { id } = params
    
    // Parse request body
    const body = await request.json()
    const { name, project_id } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Section name is required' },
        { status: 400 }
      )
    }

    // Verify that the section belongs to a project owned by the user
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('project_id, projects!inner(*)')
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Section not found or access denied' },
        { status: 404 }
      )
    }

    // If project_id is provided, verify it belongs to the user
    if (project_id && project_id !== section.project_id) {
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
    }

    // Prepare updates
    const updates = { name }
    if (project_id) updates.project_id = project_id

    // Update the section
    const { data, error } = await supabase
      .from('sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating section:', error)
      return NextResponse.json(
        { error: 'Failed to update section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, section: data })
  } catch (error) {
    console.error('Error in PUT /api/sections/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE a section
export async function DELETE(request, context) {
  try {
    const { params } = context
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

    const { id } = params

    // Verify that the section belongs to a project owned by the user
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('project_id, projects!inner(*)')
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Section not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the section
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting section:', error)
      return NextResponse.json(
        { error: 'Failed to delete section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/sections/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 