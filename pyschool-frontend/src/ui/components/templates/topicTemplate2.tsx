"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TemplateBox2 from "../molecules/templateBox2";
import CustomButton from "../atoms/btnOthers";

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
    throw new Error(error.message || 'Error creating topic');
  }

  const result = await response.json();
  return result.data;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null; 
  } catch (e) {
    return null;
  }
};

type ContentBlock = {
  type: 'subtitles' | 'video' | 'image' | 'audio' | 'presentation';
  data: any;
}

export default function TopicTemplate2() {
  const router = useRouter();
  const [layout, setLayout] = useState<"vertical2" | "horizontal2">("vertical2");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicData, setTopicData] = useState<CreateTopicRequest | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('topicData');
    if (!storedData) {
      alert("No se encontraron datos del tópico. Redirigiendo...");
      router.push('/teacherPages/addContent');
      return;
    }
    const data = JSON.parse(storedData) as CreateTopicRequest;
    setTopicData(data);
    const blocks: ContentBlock[] = [];
    if (data.subtitles && data.subtitles.length > 0) {
      blocks.push({ type: 'subtitles', data: data.subtitles });
    }
    if (data.videos && data.videos.length > 0) {
      blocks.push({ type: 'video', data: data.videos });
    }
    if (data.images && data.images.length > 0) {
      blocks.push({ type: 'image', data: data.images });
    }
    if (data.audios && data.audios.length > 0) {
      blocks.push({ type: 'audio', data: data.audios });
    }
    if (data.presentations && data.presentations.length > 0) {
      blocks.push({ type: 'presentation', data: data.presentations });
    }
    setContentBlocks(blocks);
  }, [router]);

  const handleSaveTemplate = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!topicData) {
        throw new Error("Los datos del tópico no están cargados.");
      }
      await createTopic({
        ...topicData, 
        templateName: layout, 
      });
      localStorage.removeItem('topicData');
      localStorage.removeItem('newTopic'); 
      alert('Tópico creado exitosamente');
      router.push('/teacherPages/addContent'); 
    } catch (err) {
      console.error('Error saving topic:', err);
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      alert('Error al guardar el tópico: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderPreviewBlock = (block: ContentBlock) => {
    let content;
    switch(block.type) {
      case 'subtitles':
        content = (
          // Se eliminó el <h4>Texto</h4>
          <div className="p-4 bg-gray-100 rounded-lg overflow-y-auto h-full">
            {(block.data as Subtitle[]).map((sub, index) => (
              <div key={index} className="mb-2">
                <strong className="text-gray-800">{sub.title}</strong>
                <p className="text-gray-600 text-sm">{sub.description}</p>
              </div>
            ))}
          </div>
        );
        break;
      case 'video':
        const videoUrl = (block.data as MediaContent[])[0].url;
        const embedUrl = getYouTubeEmbedUrl(videoUrl);

        content = (
          // Se añadió lógica de <iframe>
          <div className="p-4 bg-gray-100 rounded-lg h-full flex flex-col">
            {embedUrl ? (
              <iframe
                className="w-full flex-1 aspect-video rounded-md"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-sm text-gray-600 break-all">
                (No se puede previsualizar el video): {videoUrl}
              </p>
            )}
          </div>
        );
        break;
      case 'image':
         content = (
          <div className="p-4 bg-gray-100 rounded-lg h-full">
            <img 
              src={(block.data as MediaContent[])[0].url} 
              alt="Vista previa" 
              className="w-full h-full object-cover rounded" 
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Error+al+cargar+imagen')}
            />
          </div>
        );
        break;
      default:
        content = (
          <div className="p-4 bg-gray-100 rounded-lg h-full">
            <p className="text-sm">{(block.data as MediaContent[])[0].name}</p>
            <p className="text-xs text-gray-500">({block.type})</p>
          </div>
        );
    }
    return <div className="flex-1 min-h-[200px] h-full">{content}</div>;
  };
    
  return (
    <main
      className="bg-[#C9DDDC] min-h-screen w-full flex flex-col items-center justify-center p-8 gap-6"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <h1 className="text-3xl font-bold text-gray-800">Vista Previa de Plantilla</h1>
      <p className="text-gray-600 -mt-4">Así se verá tu tópico con 2 elementos.</p>
      
      <TemplateBox2
        defaultLayout={layout}
        onLayoutChange={setLayout}
      >
        {contentBlocks.length === 2 ? (
          renderPreviewBlock(contentBlocks[0])
        ) : (
          <span className="text-gray-400">Cargando...</span>
        )}
        
        {contentBlocks.length === 2 ? (
          renderPreviewBlock(contentBlocks[1])
        ) : (
          <span className="text-gray-400">Cargando...</span>
        )}
      </TemplateBox2>

      <CustomButton
        text={saving ? "Guardando..." : "Save"}
        backgroundColor="#0B1D75"
        textColor="#fff"
        onClick={handleSaveTemplate}
        disabled={saving || contentBlocks.length !== 2} 
        className="px-8 py-2 text-sm"
      />

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
    </main>
  );
}