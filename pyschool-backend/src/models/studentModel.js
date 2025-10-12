import pool from '../config/db.js'

export const getAllStudentsService = async () => {
  const result = await pool.query(`
    SELECT * FROM "Student"
    ORDER BY "idStudent"
  `)
  return result.rows
}

export const getStudentByIdService = async (id) => {
  const result = await pool.query(`
    SELECT * FROM "Student" 
    WHERE "idStudent" = $1
  `, [id])
  return result.rows[0]
}

export const createStudentService = async (nameStudent, lastnameStudent) => {
  const result = await pool.query(`
    INSERT INTO "Student" ("nameStudent", "lastnameStudent") 
    VALUES ($1, $2) 
    RETURNING *
  `, [nameStudent, lastnameStudent])
  return result.rows[0]
}

export const updateStudentService = async (id, nameStudent, lastnameStudent) => {
  const result = await pool.query(`
    UPDATE "Student" 
    SET "nameStudent" = $1, "lastnameStudent" = $2 
    WHERE "idStudent" = $3 
    RETURNING *
  `, [nameStudent, lastnameStudent, id])
  return result.rows[0]
}

export const deleteStudentService = async (id) => {
  const result = await pool.query(`
    DELETE FROM "Student" 
    WHERE "idStudent" = $1 
    RETURNING *
  `, [id])
  return result.rows[0]
}
