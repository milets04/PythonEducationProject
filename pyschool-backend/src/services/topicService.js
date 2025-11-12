// src/services/topicService.js
// Servicio para gestión de tópicos con contenido multimedia

/* eslint-disable */

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
    presentations, // Array de {url, name}
  } = topicData

  // Validar que la unidad existe
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
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
        contentExternalId: templateName, // Guardamos el nombre de la plantilla aquí
      },
    })

    // 2. Crear el content que enlaza topic con unit
    const content = await tx.content.create({
      data: {
        unitId,
        topicId: newTopic.id,
        position,
      },
    })

    // 3. Crear textos (subtítulos con descripciones)
    if (subtitles && subtitles.length > 0) {
      for (const subtitle of subtitles) {
        const text = await tx.text.create({
          data: {
            content: JSON.stringify({
              title: subtitle.title,
              description: subtitle.description,
            }),
            type: 'subtitle',
          },
        })

        // Enlazar texto con tópico
        await tx.transcriptTopic.create({
          data: {
            textId: text.id,
            topicId: newTopic.id,
          },
        })
      }
    }

    // 4. Crear multimedia (videos, imágenes, audios, presentaciones)
    const multimediaItems = [
      ...(videos || []).map(v => ({ ...v, type: 'video' })),
      ...(images || []).map(i => ({ ...i, type: 'image' })),
      ...(audios || []).map(a => ({ ...a, type: 'audio' })),
      ...(presentations || []).map(p => ({ ...p, type: 'presentation' })),
    ]

    for (const item of multimediaItems) {
      const multimedia = await tx.multimedia.create({
        data: {
          url: item.url,
          name: item.name || null,
          type: item.type,
        },
      })

      // Enlazar multimedia con tópico
      await tx.topicMultimedia.create({
        data: {
          topicId: newTopic.id,
          multimediaId: multimedia.id,
        },
      })
    }

    // Retornar el tópico completo con sus relaciones
    return await tx.topic.findUnique({
      where: { id: newTopic.id },
      include: {
        transcriptTopics: {
          include: {
            text: true,
          },
        },
        topicMultimedias: {
          include: {
            multimedia: true,
          },
        },
        contents: {
          include: {
            unit: true,
          },
        },
      },
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
          text: true,
        },
      },
      topicMultimedias: {
        include: {
          multimedia: true,
        },
      },
      contents: {
        include: {
          unit: {
            include: {
              course: true,
            },
          },
        },
      },
    },
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
      topicId: { not: null },
    },
    include: {
      topic: {
        include: {
          transcriptTopics: {
            include: {
              text: true,
            },
          },
          topicMultimedias: {
            include: {
              multimedia: true,
            },
          },
        },
      },
    },
    orderBy: {
      position: 'asc',
    },
  })

  return contents.map(c => formatTopicResponse(c.topic))
}

/**
 * Actualiza un tópico existente
 * @param {number} topicId - ID del tópico
 * @param {Object} updateData - Datos a actualizar
 * @param {number} userId - ID del usuario que actualiza
 * @returns {Object} - Tópico actualizado
 */
export const updateTopic = async (topicId, updateData, userId) => {
  const {
    name,
    position,
    templateName,
    subtitles,
    videos,
    images,
    audios,
    presentations,
    changeDescription,
  } = updateData

  // Verificar que el tópico existe
  const existingTopic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      transcriptTopics: {
        include: { text: true },
      },
      topicMultimedias: {
        include: { multimedia: true },
      },
    },
  })

  if (!existingTopic) {
    throw new Error('Tópico no encontrado')
  }

  // Determinar tipo de cambio
  let changeType = 'UPDATE'
  if (templateName && templateName !== existingTopic.contentExternalId) {
    changeType = 'TEMPLATE_CHANGE'
  }

  const updatedTopic = await prisma.$transaction(async (tx) => {
    // 1. Actualizar datos básicos del tópico
    const newVersion = existingTopic.currentVersion + 1
    const updated = await tx.topic.update({
      where: { id: topicId },
      data: {
        name: name || existingTopic.name,
        contentExternalId: templateName || existingTopic.contentExternalId,
        currentVersion: newVersion,
      },
    })

    // 2. Si hay nueva posición, actualizar content
    if (position !== undefined) {
      const content = await tx.content.findFirst({
        where: { topicId },
      })

      if (content) {
        await tx.content.update({
          where: { id: content.id },
          data: { position },
        })
      }
    }

    // 3. Guardar datos actuales para la versión
    const updatedSubtitles = []
    const updatedMultimedia = []

    // 4. Si hay subtítulos nuevos, eliminar antiguos y crear nuevos
    if (subtitles && subtitles.length > 0) {
      // Eliminar relaciones antiguas
      const oldTranscripts = await tx.transcriptTopic.findMany({
        where: { topicId },
        include: { text: true },
      })

      for (const transcript of oldTranscripts) {
        await tx.transcriptTopic.delete({
          where: {
            textId_topicId: {
              textId: transcript.textId,
              topicId: transcript.topicId,
            },
          },
        })
        await tx.text.delete({
          where: { id: transcript.textId },
        })
      }

      // Crear nuevos subtítulos
      for (const subtitle of subtitles) {
        const text = await tx.text.create({
          data: {
            content: JSON.stringify({
              title: subtitle.title,
              description: subtitle.description,
            }),
            type: 'subtitle',
          },
        })

        await tx.transcriptTopic.create({
          data: {
            textId: text.id,
            topicId,
          },
        })

        updatedSubtitles.push({
          id: text.id,
          title: subtitle.title,
          description: subtitle.description,
        })
      }
    }

    // 5. Si hay multimedia nuevo, eliminar antiguo y crear nuevo
    if (videos || images || audios || presentations) {
      // Eliminar multimedia antiguo
      const oldMultimedia = await tx.topicMultimedia.findMany({
        where: { topicId },
        include: { multimedia: true },
      })

      for (const tm of oldMultimedia) {
        await tx.topicMultimedia.delete({
          where: {
            topicId_multimediaId: {
              topicId: tm.topicId,
              multimediaId: tm.multimediaId,
            },
          },
        })
        await tx.multimedia.delete({
          where: { id: tm.multimediaId },
        })
      }

      // Crear nuevo multimedia
      const multimediaItems = [
        ...(videos || []).map(v => ({ ...v, type: 'video' })),
        ...(images || []).map(i => ({ ...i, type: 'image' })),
        ...(audios || []).map(a => ({ ...a, type: 'audio' })),
        ...(presentations || []).map(p => ({ ...p, type: 'presentation' })),
      ]

      for (const item of multimediaItems) {
        const multimedia = await tx.multimedia.create({
          data: {
            url: item.url,
            name: item.name || null,
            type: item.type,
          },
        })

        await tx.topicMultimedia.create({
          data: {
            topicId,
            multimediaId: multimedia.id,
          },
        })

        updatedMultimedia.push(multimedia)
      }
    }

    // 6. CREAR NUEVA VERSIÓN
    await tx.topicVersion.create({
      data: {
        topicId,
        versionNumber: newVersion,
        name: name || existingTopic.name,
        templateName: templateName || existingTopic.contentExternalId,
        contentData: {
          subtitles: updatedSubtitles.length > 0 ? updatedSubtitles : formatExistingSubtitles(existingTopic.transcriptTopics),
          multimedia: updatedMultimedia.length > 0 ? updatedMultimedia : existingTopic.topicMultimedias.map(tm => tm.multimedia),
          position,
        },
        changeType,
        changeDescription: changeDescription || `Actualización de ${changeType === 'TEMPLATE_CHANGE' ? 'plantilla' : 'contenido'}`,
        modifiedBy: userId,
      },
    })

    // Retornar tópico actualizado con relaciones
    return await tx.topic.findUnique({
      where: { id: topicId },
      include: {
        transcriptTopics: {
          include: {
            text: true,
          },
        },
        topicMultimedias: {
          include: {
            multimedia: true,
          },
        },
        contents: {
          include: {
            unit: true,
          },
        },
      },
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
    where: { id: topicId },
  })

  if (!topic) {
    throw new Error('Tópico no encontrado')
  }

  // Prisma eliminará automáticamente las relaciones por CASCADE
  await prisma.topic.delete({
    where: { id: topicId },
  })

  return {
    success: true,
    message: 'Tópico eliminado exitosamente',
    deletedTopicId: topicId,
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
      description: parsed.description,
    }
  }) || []

  return {
    id: topic.id,
    name: topic.name,
    templateName: topic.contentExternalId,
    currentVersion: topic.currentVersion || 1,
    unit: topic.contents?.[0]?.unit || null,
    position: topic.contents?.[0]?.position || null,
    subtitles,
    videos,
    images,
    audios,
    presentations,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
  }
}

/**
 * Formatea subtítulos existentes
 */
const formatExistingSubtitles = (transcriptTopics) => {
  return transcriptTopics?.map(tt => {
    const parsed = JSON.parse(tt.text.content)
    return {
      id: tt.text.id,
      title: parsed.title,
      description: parsed.description,
    }
  }) || []
}

/**
 * Obtiene el historial de versiones de un tópico
 * @param {number} topicId - ID del tópico
 * @returns {Array} - Lista de versiones
 */
export const getTopicVersionHistory = async (topicId) => {
  const versions = await prisma.topicVersion.findMany({
    where: { topicId },
    include: {
      modifier: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      versionNumber: 'desc',
    },
  })

  return versions.map(v => ({
    id: v.id,
    versionNumber: v.versionNumber,
    name: v.name,
    templateName: v.templateName,
    changeType: v.changeType,
    changeDescription: v.changeDescription,
    modifiedBy: {
      id: v.modifier.id,
      name: `${v.modifier.firstName} ${v.modifier.lastName}`,
      email: v.modifier.email,
    },
    modifiedAt: v.modifiedAt,
    contentPreview: {
      subtitlesCount: v.contentData.subtitles?.length || 0,
      multimediaCount: v.contentData.multimedia?.length || 0,
    },
  }))
}

/**
 * Obtiene una versión específica de un tópico
 * @param {number} topicId - ID del tópico
 * @param {number} versionNumber - Número de versión
 * @returns {Object} - Versión completa
 */
export const getTopicVersion = async (topicId, versionNumber) => {
  const version = await prisma.topicVersion.findUnique({
    where: {
      topicId_versionNumber: {
        topicId,
        versionNumber,
      },
    },
    include: {
      modifier: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      topic: {
        include: {
          contents: {
            include: {
              unit: true,
            },
          },
        },
      },
    },
  })

  if (!version) {
    throw new Error('Versión no encontrada')
  }

  // Separar multimedia por tipo del contentData
  const multimedia = version.contentData.multimedia || []
  const videos = multimedia.filter(m => m.type === 'video')
  const images = multimedia.filter(m => m.type === 'image')
  const audios = multimedia.filter(m => m.type === 'audio')
  const presentations = multimedia.filter(m => m.type === 'presentation')

  return {
    id: version.id,
    topicId: version.topicId,
    versionNumber: version.versionNumber,
    name: version.name,
    templateName: version.templateName,
    changeType: version.changeType,
    changeDescription: version.changeDescription,
    modifiedBy: {
      id: version.modifier.id,
      name: `${version.modifier.firstName} ${version.modifier.lastName}`,
      email: version.modifier.email,
    },
    modifiedAt: version.modifiedAt,
    unit: version.topic.contents?.[0]?.unit || null,
    position: version.contentData.position,
    subtitles: version.contentData.subtitles || [],
    videos,
    images,
    audios,
    presentations,
  }
}

/**
 * Restaura una versión anterior del tópico
 * @param {number} topicId - ID del tópico
 * @param {number} versionNumber - Número de versión a restaurar
 * @param {number} userId - ID del usuario que restaura
 * @returns {Object} - Tópico restaurado
 */
export const restoreTopicVersion = async (topicId, versionNumber, userId) => {
  // Obtener la versión a restaurar
  const versionToRestore = await prisma.topicVersion.findUnique({
    where: {
      topicId_versionNumber: {
        topicId,
        versionNumber,
      },
    },
  })

  if (!versionToRestore) {
    throw new Error('Versión no encontrada')
  }

  // Obtener tópico actual
  const currentTopic = await prisma.topic.findUnique({
    where: { id: topicId },
  })

  if (!currentTopic) {
    throw new Error('Tópico no encontrado')
  }

  // Restaurar usando la función de actualización
  const contentData = versionToRestore.contentData
  const restoredTopic = await updateTopic(
    topicId,
    {
      name: versionToRestore.name,
      templateName: versionToRestore.templateName,
      position: contentData.position,
      subtitles: contentData.subtitles,
      videos: contentData.multimedia?.filter(m => m.type === 'video') || [],
      images: contentData.multimedia?.filter(m => m.type === 'image') || [],
      audios: contentData.multimedia?.filter(m => m.type === 'audio') || [],
      presentations: contentData.multimedia?.filter(m => m.type === 'presentation') || [],
      changeDescription: `Restauración de versión ${versionNumber}`,
    },
    userId
  )

  return restoredTopic
}

/**
 * Compara dos versiones de un tópico
 * @param {number} topicId - ID del tópico
 * @param {number} version1 - Primera versión
 * @param {number} version2 - Segunda versión
 * @returns {Object} - Comparación de versiones
 */
export const compareTopicVersions = async (topicId, version1, version2) => {
  const v1 = await getTopicVersion(topicId, version1)
  const v2 = await getTopicVersion(topicId, version2)

  const differences = {
    name: v1.name !== v2.name,
    template: v1.templateName !== v2.templateName,
    subtitlesCount: v1.subtitles.length !== v2.subtitles.length,
    videosCount: v1.videos.length !== v2.videos.length,
    imagesCount: v1.images.length !== v2.images.length,
    audiosCount: v1.audios.length !== v2.audios.length,
    presentationsCount: v1.presentations.length !== v2.presentations.length,
  }

  return {
    version1: {
      number: v1.versionNumber,
      name: v1.name,
      template: v1.templateName,
      modifiedBy: v1.modifiedBy.name,
      modifiedAt: v1.modifiedAt,
    },
    version2: {
      number: v2.versionNumber,
      name: v2.name,
      template: v2.templateName,
      modifiedBy: v2.modifiedBy.name,
      modifiedAt: v2.modifiedAt,
    },
    differences,
    hasDifferences: Object.values(differences).some(d => d === true),
  }
}