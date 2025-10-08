import pool from '../config/db.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)

export const getAllUserService = async () => {
  const result = await pool.query(`
    SELECT 
      "idUser", 
      "nameUser", 
      "lastnameUser", 
      "mailUser", 
      "userRole", 
      "idTeacher", 
      "idStudent", 
      "isActive", 
      "createdAt", 
      "lastLogin",
      "passwordUser"
    FROM "Users"
    ORDER BY "idUser"
  `)
  return result.rows
}

export const getUserByIdService = async (id) => {
  const result = await pool.query(`
    SELECT 
      "idUser", 
      "nameUser", 
      "lastnameUser", 
      "mailUser", 
      "userRole", 
      "idTeacher", 
      "idStudent", 
      "isActive", 
      "createdAt", 
      "lastLogin",
      "passwordUser"  
    FROM "Users" 
    WHERE "idUser" = $1
  `, [id])
  return result.rows[0]
}

export const getUserByEmailService = async (email) => {
  const result = await pool.query(`
    SELECT * FROM "Users" WHERE "mailUser" = $1
  `, [email])
  return result.rows[0]
}

export const createUserService = async (userData) => {
  const { nameUser, lastnameUser, mailUser, passwordUser, userRole, idTeacher, idStudent } = userData

  // Encriptar password
  const hashedPassword = await bcrypt.hash(passwordUser, SALT_ROUNDS)

  const result = await pool.query(`
    INSERT INTO "Users" (
      "nameUser", 
      "lastnameUser", 
      "mailUser", 
      "passwordUser", 
      "userRole", 
      "idTeacher", 
      "idStudent"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING 
      "idUser", 
      "nameUser", 
      "lastnameUser", 
      "mailUser", 
      "userRole", 
      "idTeacher", 
      "idStudent", 
      "isActive", 
      "createdAt"
  `, [nameUser, lastnameUser, mailUser, hashedPassword, userRole, idTeacher, idStudent])

  return result.rows[0]
}

export const updateUserService = async (id, userData) => {
  const { nameUser, lastnameUser, mailUser, passwordUser, userRole, idTeacher, idStudent, isActive } = userData

  let hashedPassword = null
  if (passwordUser) {
    hashedPassword = await bcrypt.hash(passwordUser, SALT_ROUNDS)
  }

  // Si no se proporciona password, no lo actualizamos
  const query = passwordUser
    ? `UPDATE "Users" 
       SET "nameUser" = $1, 
           "lastnameUser" = $2, 
           "mailUser" = $3, 
           "passwordUser" = $4, 
           "userRole" = $5, 
           "idTeacher" = $6, 
           "idStudent" = $7, 
           "isActive" = $8 
       WHERE "idUser" = $9 
       RETURNING 
         "idUser", 
         "nameUser", 
         "lastnameUser", 
         "mailUser", 
         "userRole", 
         "idTeacher", 
         "idStudent", 
         "isActive", 
         "createdAt", 
         "lastLogin"`
    : `UPDATE "Users" 
       SET "nameUser" = $1, 
           "lastnameUser" = $2, 
           "mailUser" = $3, 
           "userRole" = $4, 
           "idTeacher" = $5, 
           "idStudent" = $6, 
           "isActive" = $7 
       WHERE "idUser" = $8 
       RETURNING 
         "idUser", 
         "nameUser", 
         "lastnameUser", 
         "mailUser", 
         "userRole", 
         "idTeacher", 
         "idStudent", 
         "isActive", 
         "createdAt", 
         "lastLogin"`

  const params = passwordUser
    ? [nameUser, lastnameUser, mailUser, hashedPassword, userRole, idTeacher, idStudent, isActive, id]
    : [nameUser, lastnameUser, mailUser, userRole, idTeacher, idStudent, isActive, id]

  const result = await pool.query(query, params)
  return result.rows[0]
}

export const deleteUserService = async (id) => {
  const result = await pool.query(`
    DELETE FROM "Users" 
    WHERE "idUser" = $1 
    RETURNING 
      "idUser", 
      "nameUser", 
      "lastnameUser", 
      "mailUser", 
      "userRole"
  `, [id])
  return result.rows[0]
}

export const updateLastLoginService = async (id) => {
  const result = await pool.query(`
    UPDATE "Users" 
    SET "lastLogin" = CURRENT_TIMESTAMP 
    WHERE "idUser" = $1 
    RETURNING "lastLogin"
  `, [id])
  return result.rows[0]
}

export const verifyPasswordService = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
