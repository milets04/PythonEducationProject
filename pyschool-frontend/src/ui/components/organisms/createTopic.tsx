'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentInput from '@/ui/components/atoms/contentInput';
import Textarea from '@/ui/components/atoms/textInput'; 
import UploadInput from '@/ui/components/molecules/uploadInput';
import { Button } from '@/ui/components/atoms/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper para obtener el token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper para headers
const getHeaders = (includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${getAuthToken()}`,
  };
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// ----- Interfaces de API -----
export interface Subtitle {
  id?: number;
  title: string;
  description: string;
}

export interface MediaContent {
  id?: number;
  url: string;
  name: string;
  type?: string;
}

export interface Topic {
  id?: number;
  name: string;
  unitId: number;
  templateName: string;
  position?: number;
  subtitles?: Subtitle[];
  videos?: MediaContent[];
  images?: MediaContent[];
  audios?: MediaContent[];
  presentations?: MediaContent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTopicRequest {
  name: string;
  unitId: number;
  templateName: string;
  position?: number;
  subtitles?: Subtitle[];
  videos?: MediaContent[];
  images?: MediaContent[];
  audios?: MediaContent[];
  presentations?: MediaContent[];
}

// ----- Función de API -----
export const createTopic = async (data: CreateTopicRequest): Promise<Topic> => {
  const response = await fetch(`${API_BASE_URL}/topics`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 400 && error.message.includes("contenido")) {
       throw new Error('Debes agregar al menos un subtítulo o un elemento multimedia');
    }
    throw new Error(error.message || 'Error creating topic');
  }

  const result = await response.json();
  return result.data;
};

interface TopicSection {
  id: number;
  subtitle: string;
  description: string;
}

interface UploadedFile {
  type: 'video' | 'image' | 'audio' | 'presentation';
  url: string;
  name: string;
}

const CreateTopic: React.FC = () => {
  const router = useRouter();
  
  const [topicInfo, setTopicInfo] = useState<{
    name: string;
    unitId: number;
    unitIndex: number;
  } | null>(null);

  const [sections, setSections] = useState<TopicSection[]>([
    { id: Date.now(), subtitle: '', description: '' },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [saving, setSaving] = useState(false);

  // Cargar información del tópico desde localStorage
  useEffect(() => {
    const storedTopic = localStorage.getItem('newTopic');
    if (storedTopic) {
      setTopicInfo(JSON.parse(storedTopic));
    } else {
      // Si no hay información, redirigir de vuelta
      router.push('/teacherPages/edTeacher');
    }
  }, [router]);

  const handleChange = (
    id: number,
    field: keyof TopicSection,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now(), subtitle: '', description: '' },
    ]);
  };

  const handleRemoveSection = (id: number) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpload = (
    type: 'video' | 'image' | 'audio' | 'presentation'
  ) => (fileOrUrl: File | string | null) => {
    if (!fileOrUrl) return;

    // Si es un File, necesitarías subirlo a un servidor primero
    // Por ahora, asumimos que es una URL
    if (typeof fileOrUrl === 'string') {
      const fileName = `${type}_${Date.now()}`;
      setUploadedFiles((prev) => [
        ...prev,
        { type, url: fileOrUrl, name: fileName }
      ]);
    } else {
      console.log('File upload not implemented yet', fileOrUrl);
      alert('Por favor, ingresa una URL en lugar de subir un archivo');
    }
  };


  const handleSave = async () => {
    if (!topicInfo) {
      alert('No hay información del tópico');
      return;
    }

    const hasSubtitles = sections.some(s => s.subtitle.trim() || s.description.trim());
    const hasMedia = uploadedFiles.length > 0;

    if (!hasSubtitles && !hasMedia) {
      alert('Debes agregar al menos un subtítulo o un elemento multimedia');
      return;
    }

    try {
      setSaving(true);

      const subtitles: Subtitle[] = sections
        .filter(s => s.subtitle.trim() || s.description.trim())
        .map(s => ({
          title: s.subtitle.trim() || 'Sin título',
          description: s.description.trim() || ''
        }));

      const videos: MediaContent[] = uploadedFiles
        .filter(f => f.type === 'video')
        .map(f => ({ url: f.url, name: f.name }));
      
      const images: MediaContent[] = uploadedFiles
        .filter(f => f.type === 'image')
        .map(f => ({ url: f.url, name: f.name }));
      
      const audios: MediaContent[] = uploadedFiles
        .filter(f => f.type === 'audio')
        .map(f => ({ url: f.url, name: f.name }));
      
      const presentations: MediaContent[] = uploadedFiles
        .filter(f => f.type === 'presentation')
        .map(f => ({ url: f.url, name: f.name }));

      // Contamos cuántos *tipos* de contenido existen
      let contentCount = 0;
      if (subtitles.length > 0) contentCount++;
      if (videos.length > 0) contentCount++;
      if (images.length > 0) contentCount++;
      if (audios.length > 0) contentCount++;
      if (presentations.length > 0) contentCount++;


      let templateName = 'standard'; 

      if (contentCount === 2) {
        // Si hay 2 tipos (ej: 1 texto y 1 video), redirigir
        templateName = 'pending-template';
      } else if (contentCount > 2) {
        // Si hay más de 2, usar 'multimedia-grid' (o lo que definas)
        templateName = 'multimedia-grid';
      }
      // Si es 1 (ej: solo texto o solo video), se queda como 'standard'

      // Si hay 2 elementos, ir a página de personalización
      if (templateName === 'pending-template') {
        localStorage.setItem('topicData', JSON.stringify({
          name: topicInfo.name,
          unitId: topicInfo.unitId,
          subtitles,
          videos,
          images,
          audios,
          presentations,
        }));
        
        router.push('/topicTemplates'); 
        return;
      }

      await createTopic({
        name: topicInfo.name,
        unitId: topicInfo.unitId,
        templateName, 
        subtitles: subtitles.length > 0 ? subtitles : undefined,
        videos: videos.length > 0 ? videos : undefined,
        images: images.length > 0 ? images : undefined,
        audios: audios.length > 0 ? audios : undefined,
        presentations: presentations.length > 0 ? presentations : undefined,
      });

      // Limpiar localStorage
      localStorage.removeItem('newTopic');

      // Redirigir de vuelta a la página principal
      alert('Tópico creado exitosamente');
      router.push('/teacherPages/addContent');
      
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Error al guardar el tópico: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Se perderán los cambios.')) {
      localStorage.removeItem('newTopic');
      router.push('/teacherPages/addContent');
    }
  };

  if (!topicInfo) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  // El resto de tu JSX (renderizado)
  return (
    <div className="min-h-screen bg-gradient-to-br bg-fondo flex items-center p-4">
      <div className="bg-gradient-to-br bg-fondo w-full max-w-5xl p-6 rounded-lg space-y-5">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Create Topic</h1>
          <p className="text-gray-600">{topicInfo.name}</p>
        </div>

        {/* Secciones de subtítulos */}
        {sections.map((section, index) => (
          <div key={section.id} className="space-y-3 border-b border-gray-300 pb-4">
            <div className="flex flex-col md:flex-row md:items-end gap-2">
              <ContentInput
                label={`Subtitle ${index + 1}`}
                value={section.subtitle}
                onChange={(e) =>
                  handleChange(section.id, 'subtitle', e.target.value)
                }
                className="flex-1"
                placeholder="Enter subtitle"
              />
              {index === sections.length - 1 ? (
                <Button
                  variant="default"
                  onClick={handleAddSection}
                  className="bg-[#0B1D75] text-white hover:bg-[#09175e]"
                >
                  Add +
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleRemoveSection(section.id)}
                  className="bg-[#485C6D] text-white hover:bg-gray-700"
                >
                  Remove
                </Button>
              )}
            </div>

            <Textarea
              label={`Description ${index + 1}`}
              value={section.description}
              onChange={(e) =>
                handleChange(section.id, 'description', e.target.value)
              }
              placeholder="Enter description"
              rows={5}
            />
          </div>
        ))}

        {/* Upload sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UploadInput label="Videos" onUpload={handleUpload('video')} />
          <UploadInput label="Images" onUpload={handleUpload('image')} />
          <UploadInput label="Audio" onUpload={handleUpload('audio')} />
          <UploadInput label="Presentation" onUpload={handleUpload('presentation')} />
        </div>

        {/* Mostrar archivos subidos */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Archivos agregados:</h3>
            <ul className="list-disc list-inside">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {file.type}: {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            onClick={handleCancel}
            className="bg-indigo-900/80 text-white hover:bg-indigo-900"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-indigo-900 text-white hover:bg-indigo-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTopic;