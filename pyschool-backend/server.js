import app from './src/app.js'
import { config } from './src/config/environment.js'

const PORT = config.server.port

app.listen(PORT, () => {
  console.log(`
  Pyson Backend Running       
  Server running at port: ${PORT} 
  Environment: ${config.server.nodeEnv}   
  Data base: PostgreSQL            
  `)
})

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})
