// prisma/seed.js
// Script para crear el primer administrador del sistema
// Ejecutar con: npm run seed

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  console.log('Iniciando seed de base de datos...')

  // Crear roles si no existen
  const roles = [
    { id: 1, name: 'student', description: 'Estudiante que consume contenido' },
    { id: 2, name: 'editorTeacher', description: 'Profesor que puede editar contenidos del curso' },
    { id: 3, name: 'executorTeacher', description: 'Profesor que imparte la materia y hace seguimiento' },
    { id: 4, name: 'administrator', description: 'Administrador del sistema' }
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role
    })
  }

  console.log('Roles creados/actualizados')

  // Verificar si ya existe un administrador
  const existingAdmin = await prisma.user.findFirst({
    where: {
      roleId: 4,
      isApproved: true
    }
  })

  if (existingAdmin) {
    console.log('   There is already an administrator in the system.:')
    console.log(`   Email: ${existingAdmin.email}`)
    console.log('   A new one will not be created.')
    return
  }

  // Crear el primer administrador
  const adminPassword = 'Admin123' // CAMBIAR EN PRODUCCIÓN
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Sistema',
      email: 'admin@virtualschool.com',
      passwordHash,
      roleId: 4,
      isApproved: true, // El admin se auto-aprueba
      approvedAt: new Date()
    }
  })

  console.log('   Administrator created succesfully:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Password: ${adminPassword}`)
  console.log('   IMPORTANTE: Cambia esta contraseña después del primer login')

  // Crear un curso de ejemplo
  const course = await prisma.course.create({
    data: {
      name: 'Python Básico',
      description: 'Curso introductorio de programación en Python'
    }
  })

  console.log('Example course created:', course.name)
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
