import clientPromise from './mongodb'

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'portofolio')
    return { client, db }
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw new Error('Failed to connect to database')
  }
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}

// Utility function untuk mengecek koneksi database
export async function testConnection() {
  try {
    const { client } = await connectToDatabase()
    await client.db().admin().ping()
    console.log('✅ Successfully connected to MongoDB')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    return false
  }
} 