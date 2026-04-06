import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env')
    }
    
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

export default mongoose
