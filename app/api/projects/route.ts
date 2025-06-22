import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic'

// GET - Mengambil semua projects atau satu project by id
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API Projects route called');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔗 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('🗄️ MONGODB_DB:', process.env.MONGODB_DB);
    
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not configured');
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection not configured',
        error: 'MONGODB_URI environment variable is missing'
      }, { status: 503 })
    }

    console.log('🔌 Attempting to connect to database...');
    const collection = await getCollection('projects')
    console.log('✅ Database connection successful');
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      console.log('🔍 Fetching single project with ID:', id);
      const project = await collection.findOne({ _id: new ObjectId(id) })
      if (!project) {
        console.log('❌ Project not found:', id);
        return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
      }
      console.log('✅ Single project fetched successfully');
      return NextResponse.json({ success: true, data: project })
    }
    
    console.log('📋 Fetching all projects...');
    const projects = await collection.find({}).toArray()
    console.log('✅ Fetched', projects.length, 'projects');
    
    return NextResponse.json({ 
      success: true, 
      data: projects,
      count: projects.length
    })
  } catch (error) {
    console.error('💥 Error in projects API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch projects',
      error: error instanceof Error ? error.message : 'Unknown error'
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