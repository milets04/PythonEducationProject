import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import errorHandling from './middlewares/errorHandler.js'
import createTables from './data/createTables.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// MIDDLEWARES
app.use(express.json())
app.use(cors())

// ROUTES
app.use('/api', teacherRoutes)
app.use('/api', studentRoutes)
app.use('/api', userRoutes)

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT current_database();')
  res.send(`The database name is ${result.rows[0].current_database}`)
})

// ERROR HANDLING
app.use(errorHandling)

// CREATE TABLES
createTables()

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
