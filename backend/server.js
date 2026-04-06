import dotenv from 'dotenv'

// Load environment variables FIRST
dotenv.config()

import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import searchRoutes from './routes/search.js'
import linesRoutes from './routes/lines.js'

const app = express()
const PORT = process.env.BACKEND_PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
console.log('📌 Registering search routes...')
app.use('/api', searchRoutes)
console.log('📌 Registering lines routes...')
app.use('/api', linesRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
