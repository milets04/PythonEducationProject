// Lee y valida variables de entorno
import dotenv from 'dotenv'
dotenv.config() // Carga desde .env

export const config = {
  database: {
    url: process.env.DATABASE_URL
  },
  server: {
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '24h'
  }
}
