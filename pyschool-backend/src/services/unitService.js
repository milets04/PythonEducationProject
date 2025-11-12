// src/services/unitService.js
// Servicio para gestión de unidades

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Crea una nueva unidad
 * @param {Object} unitData - {name, courseId, position}
 * @returns {Object} - Unidad creada
 */
export const createUnit = async (unitData) => {
  const { name, courseId, position } = unitData

  // Validar que el curso existe
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    throw new Error('The specified course does not exist.')
  }

  // Si no se proporciona posición, calcular la siguiente
  let finalPosition = position
  if (!finalPosition) {
    const lastUnit = await prisma.unit.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' }
    })
    finalPosition = lastUnit ? lastUnit.position + 1 : 1
  }

  const unit = await prisma.unit.create({
    data: {
      name,
      courseId,
      position: finalPosition
    },
    include: {
      course: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return unit
}

/**
 * Obtiene una unidad por ID con sus tópicos
 * @param {number} unitId - ID de la unidad
 * @returns {Object} - Unidad con tópicos
 */
export const getUnitById = async (unitId) => {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      course: {
        select: {
          id: true,
          name: true
        }
      },
      contents: {
        where: {
          topicId: { not: null }
        },
        include: {
          topic: {
            include: {
              transcriptTopics: {
                include: {
                  text: true
                }
              },
              topicMultimedias: {
                include: {
                  multimedia: true
                }
              }
            }
          }
        },
        orderBy: {
          position: 'asc'
        }
      }
    }
  })

  if (!unit) {
    throw new Error('Drive not found')
  }

  return {
    ...unit,
    topics: unit.contents.map(c => c.topic)
  }
}

/**
 * Obtiene todas las unidades de un curso
 * @param {number} courseId - ID del curso
 * @returns {Array} - Lista de unidades
 */
export const getUnitsByCourse = async (courseId) => {
  const units = await prisma.unit.findMany({
    where: { courseId },
    include: {
      contents: {
        where: {
          topicId: { not: null }
        },
        include: {
          topic: true
        }
      }
    },
    orderBy: {
      position: 'asc'
    }
  })

  return units.map(unit => ({
    ...unit,
    topicCount: unit.contents.length
  }))
}

/**
 * Actualiza una unidad
 * @param {number} unitId - ID de la unidad
 * @param {Object} updateData - {name, position}
 * @returns {Object} - Unidad actualizada
 */
export const updateUnit = async (unitId, updateData) => {
  const { name, position } = updateData

  const existingUnit = await prisma.unit.findUnique({
    where: { id: unitId }
  })

  if (!existingUnit) {
    throw new Error('Drive not found')
  }

  const updatedUnit = await prisma.unit.update({
    where: { id: unitId },
    data: {
      name: name || existingUnit.name,
      position: position !== undefined ? position : existingUnit.position
    },
    include: {
      course: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return updatedUnit
}

/**
 * Elimina una unidad y todos sus tópicos
 * @param {number} unitId - ID de la unidad
 * @returns {Object} - Confirmación
 */
export const deleteUnit = async (unitId) => {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      contents: true
    }
  })

  if (!unit) {
    throw new Error('Drive not found')
  }

  // Prisma eliminará automáticamente los contents y sus relaciones por CASCADE
  await prisma.unit.delete({
    where: { id: unitId }
  })

  return {
    success: true,
    message: 'Unit successfully removed',
    deletedUnitId: unitId,
    deletedTopicsCount: unit.contents.length
  }
}

/**
 * Reordena unidades dentro de un curso
 * @param {number} courseId - ID del curso
 * @param {Array} newOrder - Array de {unitId, position}
 * @returns {Array} - Unidades reordenadas
 */
export const reorderUnits = async (courseId, newOrder) => {
  // Validar que todas las unidades pertenecen al curso
  const units = await prisma.unit.findMany({
    where: {
      courseId,
      id: { in: newOrder.map(o => o.unitId) }
    }
  })

  if (units.length !== newOrder.length) {
    throw new Error('Some units do not belong to the specified course.')
  }

  // Actualizar posiciones en transacción
  await prisma.$transaction(
    newOrder.map(({ unitId, position }) =>
      prisma.unit.update({
        where: { id: unitId },
        data: { position }
      })
    )
  )

  // Retornar unidades reordenadas
  return await getUnitsByCourse(courseId)
}
