import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabaseClient'
import { getUserIdFromEmail } from '@/lib/authUtils'

// GET a specific task
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

    // Fetch the specific task
    const { data, error } = await supabase
      .from('tasks')
      .select('*, sections!inner(*, projects!inner(*))')
      .eq('id', id)
      .eq('sections.projects.user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching task:', error)
      return NextResponse.json(
        { error: 'Failed to fetch task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ task: data })
  } catch (error) {
    console.error('Error in GET /api/tasks/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT to update a task
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
    const { title, section_id, parent_task_id, due_date, is_completed } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    // Verify that the task belongs to a section owned by the user
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('section_id, sections!inner(*, projects!inner(*))')
      .eq('id', id)
      .eq('sections.projects.user_id', userId)
      .single()

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      )
    }

    // If section_id is provided and different from current, verify it belongs to the user
    if (section_id && section_id !== task.section_id) {
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
    }

    // If parent_task_id is provided, verify it belongs to the user
    if (parent_task_id !== undefined) {
      if (parent_task_id === null) {
        // Allow setting parent_task_id to null
      } else {
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
    }

    // Prepare updates
    const updates = { title }
    if (section_id) updates.section_id = section_id
    if (parent_task_id !== undefined) updates.parent_task_id = parent_task_id
    if (due_date !== undefined) updates.due_date = due_date
    if (is_completed !== undefined) updates.is_completed = is_completed

    // Update the task
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, task: data })
  } catch (error) {
    console.error('Error in PUT /api/tasks/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE a task
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

    // Verify that the task belongs to a section owned by the user
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('section_id, sections!inner(*, projects!inner(*))')
      .eq('id', id)
      .eq('sections.projects.user_id', userId)
      .single()

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/tasks/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 