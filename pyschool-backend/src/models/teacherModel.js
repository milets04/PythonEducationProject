import pool from '../config/db.js'

export const getAllTeachersService = async () => {
  const result = await pool.query(`
    SELECT * FROM "Teacher"
    ORDER BY "idTeacher"
  `)
  return result.rows
}

export const getTeacherByIdService = async (id) => {
  const result = await pool.query(`
    SELECT * FROM "Teacher" 
    WHERE "idTeacher" = $1
  `, [id])
  return result.rows[0]
}

export const createTeacherService = async (nameTeacher, lastnameTeacher) => {
  const result = await pool.query(`
    INSERT INTO "Teacher" ("nameTeacher", "lastnameTeacher") 
    VALUES ($1, $2) 
    RETURNING *
  `, [nameTeacher, lastnameTeacher])
  return result.rows[0]
}

export const updateTeacherService = async (id, nameTeacher, lastnameTeacher) => {
  const result = await pool.query(`
    UPDATE "Teacher" 
    SET "nameTeacher" = $1, "lastnameTeacher" = $2 
    WHERE "idTeacher" = $3 
    RETURNING *
  `, [nameTeacher, lastnameTeacher, id])
  return result.rows[0]
}

export const deleteTeacherService = async (id) => {
  const result = await pool.query(`
    DELETE FROM "Teacher" 
    WHERE "idTeacher" = $1 
    RETURNING *
  `, [id])
  return result.rows[0]
}
