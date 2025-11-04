// src/services/topicService.js
// Servicio para gestión de tópicos con contenido multimedia

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Crea un nuevo tópico con su contenido multimedia
 * @param {Object} topicData - Datos del tópico
 * @returns {Object} - Tópico creado
 */
export const createTopic = async (topicData) => {
  const {
    name,
    unitId,
    position,
    templateName, // Nombre de la plantilla para renderizar
    subtitles, // Array de {title, description}
    videos, // Array de {url, name}
    images, // Array de {url, name}
    audios, // Array de {url, name}
    presentations // Array de {url, name}
  } = topicData

  // Validar que la unidad existe
  const unit = await prisma.unit.findUnique({
    where: { id: unitId }
  })

  if (!unit) {
    throw new Error('La unidad especificada no existe')
  }

  // Crear el tópico con todo su contenido en una transacción
  const topic = await prisma.$transaction(async (tx) => {
    // 1. Crear el tópico base
    const newTopic = await tx.topic.create({
      data: {
        name,
        contentExternalId: templateName // Guardamos el nombre de la plantilla aquí
      }
    })

    // 2. Crear el content que enlaza topic con unit
    const content = await tx.content.create({
      data: {
        unitId,
        topicId: newTopic.id,
        position
      }
    })
    console.log(content)

    // 3. Crear textos (subtítulos con descripciones)
    if (subtitles && subtitles.length > 0) {
      for (const subtitle of subtitles) {
        const text = await tx.text.create({
          data: {
            content: JSON.stringify({
              title: subtitle.title,
              description: subtitle.description
            }),
            type: 'subtitle'
          }
        })

        // Enlazar texto con tópico
        await tx.transcriptTopic.create({
          data: {
            textId: text.id,
            topicId: newTopic.id
          }
        })
      }
    }

    // 4. Crear multimedia (videos, imágenes, audios, presentaciones)
    const multimediaItems = [
      ...(videos || []).map(v => ({ ...v, type: 'video' })),
      ...(images || []).map(i => ({ ...i, type: 'image' })),
      ...(audios || []).map(a => ({ ...a, type: 'audio' })),
      ...(presentations || []).map(p => ({ ...p, type: 'presentation' }))
    ]

    for (const item of multimediaItems) {
      const multimedia = await tx.multimedia.create({
        data: {
          url: item.url,
          name: item.name || null,
          type: item.type
        }
      })

      // Enlazar multimedia con tópico
      await tx.topicMultimedia.create({
        data: {
          topicId: newTopic.id,
          multimediaId: multimedia.id
        }
      })
    }

    // Retornar el tópico completo con sus relaciones
    return await tx.topic.findUnique({
      where: { id: newTopic.id },
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
        },
        contents: {
          include: {
            unit: true
          }
        }
      }
    })
  })

  return topic
}

/**
 * Obtiene un tópico por ID con todo su contenido
 * @param {number} topicId - ID del tópico
 * @returns {Object} - Tópico con contenido
 */
export const getTopicById = async (topicId) => {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
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
      },
      contents: {
        include: {
          unit: {
            include: {
              course: true
            }
          }
        }
      }
    }
  })

  if (!topic) {
    throw new Error('Tópico no encontrado')
  }

  // Formatear la respuesta para facilitar su uso en el frontend
  return formatTopicResponse(topic)
}

/**
 * Obtiene todos los tópicos de una unidad
 * @param {number} unitId - ID de la unidad
 * @returns {Array} - Lista de tópicos
 */
export const getTopicsByUnit = async (unitId) => {
  const contents = await prisma.content.findMany({
    where: {
      unitId,
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
  })

  return contents.map(c => formatTopicResponse(c.topic))
}

/**
 * Actualiza un tópico existente
 * @param {number} topicId - ID del tópico
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Tópico actualizado
 */
export const updateTopic = async (topicId, updateData) => {
  const {
    name,
    position,
    templateName,
    subtitles,
    videos,
    images,
    audios,
    presentations
  } = updateData

  // Verificar que el tópico existe
  const existingTopic = await prisma.topic.findUnique({
    where: { id: topicId }
  })

  if (!existingTopic) {
    throw new Error('Tópico no encontrado')
  }

  const updatedTopic = await prisma.$transaction(async (tx) => {
    // 1. Actualizar datos básicos del tópico
    const updated = await tx.topic.update({
      where: { id: topicId },
      data: {
        name: name || existingTopic.name,
        contentExternalId: templateName || existingTopic.contentExternalId
      }
    })
    console.log(updated)

    // 2. Si hay nueva posición, actualizar content
    if (position !== undefined) {
      const content = await tx.content.findFirst({
        where: { topicId }
      })

      if (content) {
        await tx.content.update({
          where: { id: content.id },
          data: { position }
        })
      }
    }

    // 3. Si hay subtítulos nuevos, eliminar antiguos y crear nuevos
    if (subtitles && subtitles.length > 0) {
      // Eliminar relaciones antiguas
      const oldTranscripts = await tx.transcriptTopic.findMany({
        where: { topicId },
        include: { text: true }
      })

      for (const transcript of oldTranscripts) {
        await tx.transcriptTopic.delete({
          where: {
            textId_topicId: {
              textId: transcript.textId,
              topicId: transcript.topicId
            }
          }
        })
        await tx.text.delete({
          where: { id: transcript.textId }
        })
      }

      // Crear nuevos subtítulos
      for (const subtitle of subtitles) {
        const text = await tx.text.create({
          data: {
            content: JSON.stringify({
              title: subtitle.title,
              description: subtitle.description
            }),
            type: 'subtitle'
          }
        })

        await tx.transcriptTopic.create({
          data: {
            textId: text.id,
            topicId
          }
        })
      }
    }

    // 4. Si hay multimedia nuevo, eliminar antiguo y crear nuevo
    if (videos || images || audios || presentations) {
      // Eliminar multimedia antiguo
      const oldMultimedia = await tx.topicMultimedia.findMany({
        where: { topicId },
        include: { multimedia: true }
      })

      for (const tm of oldMultimedia) {
        await tx.topicMultimedia.delete({
          where: {
            topicId_multimediaId: {
              topicId: tm.topicId,
              multimediaId: tm.multimediaId
            }
          }
        })
        await tx.multimedia.delete({
          where: { id: tm.multimediaId }
        })
      }

      // Crear nuevo multimedia
      const multimediaItems = [
        ...(videos || []).map(v => ({ ...v, type: 'video' })),
        ...(images || []).map(i => ({ ...i, type: 'image' })),
        ...(audios || []).map(a => ({ ...a, type: 'audio' })),
        ...(presentations || []).map(p => ({ ...p, type: 'presentation' }))
      ]

      for (const item of multimediaItems) {
        const multimedia = await tx.multimedia.create({
          data: {
            url: item.url,
            name: item.name || null,
            type: item.type
          }
        })

        await tx.topicMultimedia.create({
          data: {
            topicId,
            multimediaId: multimedia.id
          }
        })
      }
    }

    // Retornar tópico actualizado con relaciones
    return await tx.topic.findUnique({
      where: { id: topicId },
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
        },
        contents: {
          include: {
            unit: true
          }
        }
      }
    })
  })

  return formatTopicResponse(updatedTopic)
}

/**
 * Elimina un tópico y todo su contenido
 * @param {number} topicId - ID del tópico
 * @returns {Object} - Confirmación
 */
export const deleteTopic = async (topicId) => {
  // Verificar que existe
  const topic = await prisma.topic.findUnique({
    where: { id: topicId }
  })

  if (!topic) {
    throw new Error('Tópico no encontrado')
  }

  // Prisma eliminará automáticamente las relaciones por CASCADE
  await prisma.topic.delete({
    where: { id: topicId }
  })

  return {
    success: true,
    message: 'Tópico eliminado exitosamente',
    deletedTopicId: topicId
  }
}

/**
 * Formatea la respuesta del tópico para el frontend
 * @param {Object} topic - Tópico de Prisma
 * @returns {Object} - Tópico formateado
 */
const formatTopicResponse = (topic) => {
  // Separar multimedia por tipo
  const multimedia = topic.topicMultimedias?.map(tm => tm.multimedia) || []

  const videos = multimedia.filter(m => m.type === 'video')
  const images = multimedia.filter(m => m.type === 'image')
  const audios = multimedia.filter(m => m.type === 'audio')
  const presentations = multimedia.filter(m => m.type === 'presentation')

  // Parsear subtítulos
  const subtitles = topic.transcriptTopics?.map(tt => {
    const parsed = JSON.parse(tt.text.content)
    return {
      id: tt.text.id,
      title: parsed.title,
      description: parsed.description
    }
  }) || []

  return {
    id: topic.id,
    name: topic.name,
    templateName: topic.contentExternalId,
    unit: topic.contents?.[0]?.unit || null,
    position: topic.contents?.[0]?.position || null,
    subtitles,
    videos,
    images,
    audios,
    presentations,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt
  }
}
