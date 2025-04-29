import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabaseClient'
import { getUserIdFromEmail } from '@/lib/authUtils'

// GET all tasks for the authenticated user
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

    // Get query parameters
    const url = new URL(request.url)
    const sectionId = url.searchParams.get('section_id')
    const projectId = url.searchParams.get('project_id')
    const parentTaskId = url.searchParams.get('parent_task_id')
    const isCompleted = url.searchParams.get('is_completed')

    // Build query
    let query = supabase
      .from('tasks')
      .select('*, sections!inner(*, projects!inner(*))')
      .eq('sections.projects.user_id', userId)
      .order('created_at', { ascending: true })

    // Apply filters if provided
    if (sectionId) {
      query = query.eq('section_id', sectionId)
    } else if (projectId) {
      // If project_id is provided, get tasks from all sections in that project
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('id')
        .eq('project_id', projectId)

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError)
        return NextResponse.json(
          { error: 'Failed to fetch sections' },
          { status: 500 }
        )
      }

      const sectionIds = sections.map(section => section.id)
      query = query.in('section_id', sectionIds)
    }

    if (parentTaskId !== null) {
      if (parentTaskId === '') {
        // Get tasks without a parent
        query = query.is('parent_task_id', null)
      } else {
        // Get tasks with a specific parent
        query = query.eq('parent_task_id', parentTaskId)
      }
    }

    if (isCompleted !== null) {
      query = query.eq('is_completed', isCompleted === 'true')
    }

    // Execute query
    const { data, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks: data })
  } catch (error) {
    console.error('Error in GET /api/tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST to create a new task
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
    const { title, section_id, parent_task_id, due_date, is_completed } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    if (!section_id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      )
    }

    // Verify that the section belongs to a project owned by the user
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('project_id, projects!inner(*)')
      .eq('id', section_id)
      .eq('projects.user_id', userId)
      .single()

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Section not found or access denied' },
        { status: 404 }
      )
    }

    // If parent_task_id is provided, verify it belongs to the user
    if (parent_task_id) {
      const { data: parentTask, error: parentTaskError } = await supabase
        .from('tasks')
        .select('id, sections!inner(*, projects!inner(*))')
        .eq('id', parent_task_id)
        .eq('sections.projects.user_id', userId)
        .single()

      if (parentTaskError || !parentTask) {
        return NextResponse.json(
          { error: 'Parent task not found or access denied' },
          { status: 404 }
        )
      }
    }

    // Create new task
    const newTask = {
      title,
      section_id,
      is_completed: is_completed || false
    }

    if (parent_task_id) {
      newTask.parent_task_id = parent_task_id
    }

    if (due_date) {
      newTask.due_date = due_date
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, task: data })
  } catch (error) {
    console.error('Error in POST /api/tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 