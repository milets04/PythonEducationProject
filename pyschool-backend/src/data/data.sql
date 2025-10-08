-- Crear tabla Teacher primero
CREATE TABLE IF NOT EXISTS "Teacher" (
  "idTeacher" SERIAL PRIMARY KEY,
  "nameTeacher" VARCHAR(100) NOT NULL,
  "lastnameTeacher" VARCHAR(100) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Student
CREATE TABLE IF NOT EXISTS "Student" (
  "idStudent" SERIAL PRIMARY KEY,
  "nameStudent" VARCHAR(100) NOT NULL,
  "lastnameStudent" VARCHAR(100) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Users con las relaciones
CREATE TABLE IF NOT EXISTS "Users" (
  "idUser" SERIAL PRIMARY KEY,
  "nameUser" VARCHAR(100) NOT NULL,
  "lastnameUser" VARCHAR(100) NOT NULL,
  "mailUser" VARCHAR(100) NOT NULL UNIQUE,
  "passwordUser" VARCHAR(255) NOT NULL,
  "userRole" VARCHAR(20) NOT NULL CHECK ("userRole" IN ('STUDENT', 'TEACHER_EDITOR', 'TEACHER_EXECUTOR')),
  "idTeacher" INTEGER REFERENCES "Teacher"("idTeacher") ON DELETE CASCADE,
  "idStudent" INTEGER REFERENCES "Student"("idStudent") ON DELETE CASCADE,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "lastLogin" TIMESTAMP,
  CONSTRAINT check_role_teacher CHECK (
    ("userRole" IN ('TEACHER_EDITOR', 'TEACHER_EXECUTOR') AND "idTeacher" IS NOT NULL AND "idStudent" IS NULL)
    OR ("userRole" = 'STUDENT' AND "idStudent" IS NOT NULL AND "idTeacher" IS NULL)
  )
);
