// server.js
// Punto de entrada principal de la aplicación

import app from './src/app.js'
import { config } from './src/config/environment.js'

const PORT = config.server.port

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`
  Virtual School Backend Running       
  Servidor iniciado en puerto: ${PORT} 
  Ambiente: ${config.server.nodeEnv}   
  Base de datos: PostgreSQL            
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
