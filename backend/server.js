import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import searchRoutes from './routes/search.js'
import linesRoutes from './routes/lines.js'

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api', searchRoutes)
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

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
