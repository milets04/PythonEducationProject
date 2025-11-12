// src/controllers/unitController.js
// Controladores para gestión de unidades

import {
  createUnit,
  getUnitById,
  getUnitsByCourse,
  updateUnit,
  deleteUnit,
  reorderUnits
} from '../services/unitService.js'

/**
 * Crear una nueva unidad
 * POST /api/units
 */
export const create = async (req, res) => {
  try {
    const { name, courseId, position } = req.body

    // Validaciones
    if (!name || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'name and courseId are required'
      })
    }

    const unit = await createUnit({
      name,
      courseId: parseInt(courseId),
      position: position ? parseInt(position) : null
    })

    return res.status(201).json({
      success: true,
      message: 'Drive created successfully',
      data: unit
    })
  } catch (error) {
    console.error('Create unit error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating unit'
    })
  }
}

/**
 * Obtener una unidad por ID
 * GET /api/units/:id
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params

    const unit = await getUnitById(parseInt(id))

    return res.status(200).json({
      success: true,
      data: unit
    })
  } catch (error) {
    console.error('Get unit error:', error)
    return res.status(404).json({
      success: false,
      message: error.message || 'Error obtaining the unit'
    })
  }
}

/**
 * Obtener todas las unidades de un curso
 * GET /api/units/course/:courseId
 */
export const getByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const units = await getUnitsByCourse(parseInt(courseId))

    return res.status(200).json({
      success: true,
      count: units.length,
      data: units
    })
  } catch (error) {
    console.error('Get units by course error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error obtaining units'
    })
  }
}

/**
 * Actualizar una unidad
 * PUT /api/units/:id
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, position } = req.body

    const unit = await updateUnit(parseInt(id), {
      name,
      position: position ? parseInt(position) : undefined
    })

    return res.status(200).json({
      success: true,
      message: 'Unit updated succesfully',
      data: unit
    })
  } catch (error) {
    console.error('Update unit error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error at updating unit'
    })
  }
}

/**
 * Eliminar una unidad
 * DELETE /api/units/:id
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params

    const result = await deleteUnit(parseInt(id))

    return res.status(200).json(result)
  } catch (error) {
    console.error('Delete unit error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error at updating unit'
    })
  }
}

/**
 * Reordenar unidades de un curso
 * PUT /api/units/course/:courseId/reorder
 */
/**
 * Reordenar unidades de un curso
 * PUT /api/units/course/:courseId/reorder
 */



/**
 * Reordenar unidades de un curso
 * PUT /api/units/course/:courseId/reorder
 */
export const reorder = async (req, res) => {
  try {
    const { courseId } = req.params
    const { newOrder } = req.body

    // Validar formato
    if (!Array.isArray(newOrder) || newOrder.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'newOrder debe ser un array no vacío de {unitId, position}'
      })
    }

    const units = await reorderUnits(parseInt(courseId), newOrder)

    return res.status(200).json({
      success: true,
      message: 'Units successfully reordered',
      data: units
    })
  } catch (error) {
    console.error('Reorder units error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error reordering units'
    })
  }
}
