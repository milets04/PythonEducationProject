// src/app.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.js'
import protectedRoutes from './routes/protectedRoutes.js'
import unitRoutes from './routes/unitRoutes.js'
import topicRoutes from './routes/topicRoutes.js'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas - EN ESTE ORDEN
app.use('/api/auth', authRoutes)
app.use('/api/protected', protectedRoutes)
app.use('/api/units', unitRoutes)
app.use('/api/topics', topicRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is working',
    timestamp: new Date().toISOString()
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not founded: ${req.method} ${req.path}`
  })
})

// Error handler
app.use((err, req, res) => {
  console.error('Global error:', err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server internal error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

export default app
