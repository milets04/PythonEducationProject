// src/controllers/topicController.js
// Controladores para gestión de tópicos y versiones

/* eslint-disable */

import {
  createTopic,
  getTopicById,
  getTopicsByUnit,
  updateTopic,
  deleteTopic,
  getTopicVersionHistory,
  getTopicVersion,
  restoreTopicVersion,
  compareTopicVersions,
} from '../services/topicService.js'

/**
 * Crear un nuevo tópico
 * POST /api/topics
 */
export const create = async (req, res) => {
  try {
    const {
      name,
      unitId,
      position,
      templateName,
      subtitles,
      videos,
      images,
      audios,
      presentations,
    } = req.body

    // Validaciones
    if (!name || !unitId || !templateName) {
      return res.status(400).json({
        success: false,
        message: 'name, unitId y templateName son obligatorios',
      })
    }

    // Validar que al menos haya algo de contenido
    const hasContent = 
      (subtitles && subtitles.length > 0) ||
      (videos && videos.length > 0) ||
      (images && images.length > 0) ||
      (audios && audios.length > 0) ||
      (presentations && presentations.length > 0)

    if (!hasContent) {
      return res.status(400).json({
        success: false,
        message: 'El tópico debe tener al menos un elemento de contenido',
      })
    }

    const topic = await createTopic({
      name,
      unitId: parseInt(unitId),
      position: position ? parseInt(position) : null,
      templateName,
      subtitles: subtitles || [],
      videos: videos || [],
      images: images || [],
      audios: audios || [],
      presentations: presentations || [],
    })

    return res.status(201).json({
      success: true,
      message: 'Tópico creado exitosamente',
      data: topic,
    })
  } catch (error) {
    console.error('Create topic error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al crear el tópico',
    })
  }
}

/**
 * Obtener un tópico por ID
 * GET /api/topics/:id
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params

    const topic = await getTopicById(parseInt(id))

    return res.status(200).json({
      success: true,
      data: topic,
    })
  } catch (error) {
    console.error('Get topic error:', error)
    return res.status(404).json({
      success: false,
      message: error.message || 'Error al obtener el tópico',
    })
  }
}

/**
 * Obtener todos los tópicos de una unidad
 * GET /api/topics/unit/:unitId
 */
export const getByUnit = async (req, res) => {
  try {
    const { unitId } = req.params

    const topics = await getTopicsByUnit(parseInt(unitId))

    return res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    })
  } catch (error) {
    console.error('Get topics by unit error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los tópicos',
    })
  }
}

/**
 * Actualizar un tópico
 * PUT /api/topics/:id
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      position,
      templateName,
      subtitles,
      videos,
      images,
      audios,
      presentations,
    } = req.body

    const topic = await updateTopic(parseInt(id), {
      name,
      position: position ? parseInt(position) : undefined,
      templateName,
      subtitles,
      videos,
      images,
      audios,
      presentations,
    })

    return res.status(200).json({
      success: true,
      message: 'Tópico actualizado exitosamente',
      data: topic,
    })
  } catch (error) {
    console.error('Update topic error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar el tópico',
    })
  }
}

/**
 * Eliminar un tópico
 * DELETE /api/topics/:id
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params

    const result = await deleteTopic(parseInt(id))

    return res.status(200).json(result)
  } catch (error) {
    console.error('Delete topic error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al eliminar el tópico',
    })
  }
}