import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection not configured' 
      }, { status: 503 })
    }

    const isConnected = await testConnection()
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database connection successful' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
} 