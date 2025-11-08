"use client";

import NavegationArrows from "@/ui/components/atoms/navegationArrows";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import UnitySelector, { UnityOption } from "@/ui/components/atoms/unitySelector";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- Helpers de API ---
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getHeaders = (includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${getAuthToken()}`,
  };
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// --- Interfaces de Datos ---
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
  templateName: string; // "standard", "vertical2", "horizontal2", "multimedia-grid"
  position?: number;
  subtitles?: Subtitle[];
  videos?: MediaContent[];
  images?: MediaContent[];
  audios?: MediaContent[];
  presentations?: MediaContent[];
}

export interface Unit {
  id?: number;
  name: string;
  courseId: number;
  position?: number;
}

// Interfaz local para la estructura del curso
interface UnitWithTopics extends Unit {
  topics: Topic[];
}

// --- Funciones de Fetching ---
export const getUnitsByCourse = async (courseId: number): Promise<Unit[]> => {
  const response = await fetch(`${API_BASE_URL}/units/course/${courseId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error fetching units');
  const result = await response.json();
  return result.data;
};

export const getTopicsByUnit = async (unitId: number): Promise<Topic[]> => {
  const response = await fetch(`${API_BASE_URL}/topics/unit/${unitId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error fetching topics');
  const result = await response.json();
  return result.data;
};

// --- Helper de YouTube ---
const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null; 
  } catch {
    return null;
  }
};

/**
 * Renderiza un bloque de contenido individual (texto, video, etc.)
 */
const RenderContentBlock = ({ type, data }: { type: string, data: Subtitle[] | MediaContent[] }) => {
  switch(type) {
    case 'subtitles':
      return (
        <div className="p-4 rounded-lg h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {(data as Subtitle[]).map((sub, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{sub.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{sub.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'video': {
      const video = (data as MediaContent[])[0];
      const embedUrl = getYouTubeEmbedUrl(video.url);
      return (
        <div className="p-4 rounded-lg h-full flex items-center justify-center">
          {embedUrl ? (
            <iframe
              className="rounded-md shadow-lg max-w-full max-h-full"
              style={{
                aspectRatio: '16/9',
                width: 'auto',
                height: 'auto'
              }}
              src={embedUrl}
              title={video.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-sm text-gray-600">Video no soportado: {video.url}</p>
          )}
        </div>
      );
    }
      
    case 'image':
      return (
        <div className="p-4 rounded-lg h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image 
              src={(data as MediaContent[])[0].url} 
              alt={(data as MediaContent[])[0].name || 'Imagen del tópico'}
              layout="fill"
              objectFit="contain"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      );
      
    default:
      return (
        <div className="p-4 rounded-lg h-full flex items-center justify-center">
          <p className="text-sm">Contenido {type} no soportado aún.</p>
        </div>
      );
  }
};

const RenderTopicContent = ({ topic }: { topic: Topic }) => {
  // 1. Coleccionar todos los bloques de contenido
  const blocks: React.ReactNode[] = [];
  if (topic.subtitles && topic.subtitles.length > 0) {
    blocks.push(<RenderContentBlock key="subtitles" type="subtitles" data={topic.subtitles} />);
  }
  if (topic.videos && topic.videos.length > 0) {
    blocks.push(<RenderContentBlock key="video" type="video" data={topic.videos} />);
  }
  if (topic.images && topic.images.length > 0) {
    blocks.push(<RenderContentBlock key="image" type="image" data={topic.images} />);
  }

  // 2. Renderizar según la plantilla
  switch (topic.templateName) {
    case 'vertical2':
      return (
        <div className="h-full flex flex-col gap-4">
          <div className="flex-1 min-h-0 overflow-hidden">{blocks[0]}</div>
          <div className="flex-1 min-h-0 overflow-hidden">{blocks[1]}</div>
        </div>
      );
    
    case 'horizontal2':
      return (
        <div className="h-full flex flex-row gap-4">
          <div className="flex-1 min-w-0 overflow-hidden">{blocks[0]}</div>
          <div className="flex-1 min-w-0 overflow-hidden">{blocks[1]}</div>
        </div>
      );
    
    case 'multimedia-grid':
      return (
        <div className="h-full grid grid-cols-2 gap-4">
          {blocks.map((block, index) => (
            <div key={index} className="min-h-0 overflow-hidden">{block}</div>
          ))}
        </div>
      );

    case 'standard':
    default:
      // Un solo bloque de contenido, o múltiples en una sola columna
      return (
        <div className="h-full flex flex-col gap-4">
          {blocks.map((block, index) => (
            <div key={index} className={blocks.length === 1 ? "h-full" : "flex-1 min-h-0 overflow-hidden"}>
              {block}
            </div>
          ))}
        </div>
      );
  }
};


export default function CourseView() {
  const [courseStructure, setCourseStructure] = useState<UnitWithTopics[]>([]);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = 1; // ID del curso (ajusta si es necesario)

  // --- Carga de datos ---
  useEffect(() => {
    const loadCourseStructure = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const units = await getUnitsByCourse(courseId);
        if (units.length === 0) {
          throw new Error("Este curso aún no tiene unidades.");
        }

        const fullStructure: UnitWithTopics[] = await Promise.all(
          units.map(async (unit) => {
            const topics = await getTopicsByUnit(unit.id!);
            return { ...unit, topics };
          })
        );
        
        setCourseStructure(fullStructure);
      } catch (err) {
        console.error('Error loading course structure:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadCourseStructure();
  }, [courseId]); // Se ejecuta si courseId cambia

  // --- Handlers de Navegación ---
  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(prev => prev - 1);
    }
  };
  
  const handleNext = () => {
    const currentUnit = courseStructure[currentUnitIndex];
    if (currentUnit && currentTopicIndex < currentUnit.topics.length - 1) {
      setCurrentTopicIndex(prev => prev + 1);
    }
  };

  const handleUnitChange = (newUnitId: string) => {
    const newIndex = courseStructure.findIndex(unit => unit.id!.toString() === newUnitId);
    if (newIndex !== -1) {
      setCurrentUnitIndex(newIndex);
      setCurrentTopicIndex(0); // Resetea al primer tópico de la nueva unidad
    }
  };

  // --- Datos actuales para renderizar ---
  const currentUnit = courseStructure[currentUnitIndex];
  const currentTopic = currentUnit?.topics[currentTopicIndex];
  const unitOptions: UnityOption[] = courseStructure.map(unit => ({
    value: unit.id!.toString(),
    label: unit.name
  }));

  // --- Renderizado del Componente ---
  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#C9DDDC' }}>
        <div className="text-gray-700">Cargando contenido del curso...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#C9DDDC' }}>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#C9DDDC' }}>
      
      <div className="px-6 py-4 flex-shrink-0">
        <UnitySelector
          value={currentUnit?.id?.toString() || ""}
          options={unitOptions}
          onChange={handleUnitChange}
        />
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0">
        <div className="bg-white rounded-lg shadow-sm h-full p-6 flex flex-col">
          
          <div className="flex flex-row justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold whitespace-nowrap">
              {currentTopic ? currentTopic.name : (currentUnit ? "Esta unidad no tiene tópicos" : "Curso vacío")}
            </h2>
              {currentTopic && (
                <NavegationArrows 
                  onPrevious={handlePrevious} 
                  onNext={handleNext}
                  isPreviousDisabled={currentTopicIndex === 0}
                  isNextDisabled={currentTopicIndex === (currentUnit?.topics.length - 1)}
                />
              )}
          </div>
          
          <div className="bg-gray-100 flex-1 rounded-lg overflow-hidden p-2 md:p-4 min-h-0">
            {currentTopic ? (
              <RenderTopicContent topic={currentTopic} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {currentUnit ? "Selecciona un tópico o crea uno." : "No hay contenido para mostrar."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}