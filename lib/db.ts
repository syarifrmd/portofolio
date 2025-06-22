import clientPromise from './mongodb'

export async function connectToDatabase() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured')
    }
    
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'portofolio')
    return { client, db }
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw new Error('Failed to connect to database')
  }
}

export async function getCollection(collectionName: string) {
  try {
    const { db } = await connectToDatabase()
    return db.collection(collectionName)
  } catch (error) {
    console.error('Error getting collection:', error)
    throw error
  }
}

// Utility function untuk mengecek koneksi database
export async function testConnection() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI is not configured')
      return false
    }
    
    const { client } = await connectToDatabase()
    await client.db().admin().ping()
    console.log('✅ Successfully connected to MongoDB')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    return false
  }
} 