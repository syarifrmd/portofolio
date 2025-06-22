import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// GET - Mengambil semua projects atau satu project by id
export async function GET(request: NextRequest) {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection not configured' 
      }, { status: 503 })
    }

    const collection = await getCollection('projects')
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      const project = await collection.findOne({ _id: new ObjectId(id) })
      if (!project) {
        return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: project })
    }
    const projects = await collection.find({}).toArray()
    return NextResponse.json({ 
      success: true, 
      data: projects 
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch projects' 
    }, { status: 500 })
  }
}

// POST - Menambah project baru
export async function POST(request: NextRequest) {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection not configured' 
      }, { status: 503 })
    }

    const body = await request.json()
    const collection = await getCollection('projects')
    
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return NextResponse.json({ 
      success: true, 
      data: { id: result.insertedId },
      message: 'Project created successfully' 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create project' 
    }, { status: 500 })
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection not configured' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Project ID is required' 
      }, { status: 400 })
    }

    const collection = await getCollection('projects')
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Project not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project updated successfully' 
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update project' 
    }, { status: 500 })
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection not configured' 
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Project ID is required' 
      }, { status: 400 })
    }

    const collection = await getCollection('projects')
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Project not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete project' 
    }, { status: 500 })
  }
} 