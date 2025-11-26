"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TemplateBox3 from "../molecules/templateBox3"; 
import CustomButton from "../atoms/btnOthers";
import { API_URL } from '@/hoc/config';

const API_BASE_URL = `${API_URL}/api`;


const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const getHeaders = (includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${getAuthToken()}`,
  };
  if (includeContentType) headers["Content-Type"] = "application/json";
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

export interface Topic extends CreateTopicRequest {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

const createTopic = async (data: CreateTopicRequest): Promise<Topic> => {
  const response = await fetch(`${API_BASE_URL}/topics`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error creating topic");
  }

  const result = await response.json();
  return result.data;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
    return null;
  } catch {
    return null;
  }
};

const getAudioEmbedUrl = (url: string): { type: 'soundcloud' | 'vocaroo' | 'direct'; url: string } | null => {
  try {
    if (url.includes('soundcloud.com')) {
      return {
        type: 'soundcloud',
        url: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`
      };
    }
    const vocarooMatch = url.match(/(?:voca\.ro|vocaroo\.com)\/([a-zA-Z0-9]+)/);
    if (vocarooMatch && vocarooMatch[1]) {
      return {
        type: 'vocaroo',
        url: `https://vocaroo.com/embed/${vocarooMatch[1]}`
      };
    }
    if (/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(url)) {
      return { type: 'direct', url: url };
    }
    return null;
  } catch {
    return null;
  }
};

// --- Helper de Canva ---
const getCanvaEmbedUrl = (url: string): string | null => {
  try {
    const designMatch = url.match(/canva\.com\/design\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)/);
    if (designMatch && designMatch[1]) {
      return `https://www.canva.com/design/${designMatch[1]}/view?embed`;
    }
    if (url.includes('canva.com') && url.includes('embed')) {
      return url;
    }
    if (url.includes('canva.com/design/')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set("embed", ""); 
        return urlObj.toString();
    }
    return null; 
  } catch {
    return null;
  }
};

type ContentBlock = {
  type: "subtitles" | "video" | "image" | "audio" | "presentation";
  data: Subtitle[] | MediaContent[];
};

export default function TopicTemplate3() {
  const router = useRouter();
  const [layout, setLayout] = useState<
    "vertical3" | "horizontal3" | "horizontal3-2" | "horizontal2-3" | "vertical2-3" | "vertical3-2"
  >("vertical3");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicData, setTopicData] = useState<CreateTopicRequest | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("topicData");
    if (!storedData) {
      alert("No se encontraron datos del tópico. Redirigiendo...");
      router.push("/teacherPages/addContent");
      return;
    }

    const data = JSON.parse(storedData) as CreateTopicRequest;
    setTopicData(data);

    const blocks: ContentBlock[] = [];
    if (data.subtitles?.length) blocks.push({ type: "subtitles", data: data.subtitles });
    if (data.videos?.length) blocks.push({ type: "video", data: data.videos });
    if (data.images?.length) blocks.push({ type: "image", data: data.images });
    if (data.audios?.length) blocks.push({ type: "audio", data: data.audios });
    if (data.presentations?.length) blocks.push({ type: "presentation", data: data.presentations });

    setContentBlocks(blocks);
  }, [router]);

  const handleSaveTemplate = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!topicData) throw new Error("Los datos del tópico no están cargados.");

      await createTopic({
        ...topicData,
        templateName: layout,
      });

      localStorage.removeItem("topicData");
      localStorage.removeItem("newTopic");
      alert("Tópico creado exitosamente");
      router.push("/teacherPages/addContent");
    } catch (err) {
      console.error("Error saving topic:", err);
      setError((err as Error).message);
      alert("Error al guardar el tópico: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const renderPreviewBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "subtitles":
        return (
          <div className="p-4 bg-gray-100 rounded-lg overflow-y-auto h-full">
            {(block.data as Subtitle[]).map((sub, index) => (
              <div key={index} className="mb-2">
                <strong className="text-gray-800">{sub.title}</strong>
                <p className="text-gray-600 text-sm">{sub.description}</p>
              </div>
            ))}
          </div>
        );

      case "video": {
        const videoUrl = (block.data as MediaContent[])[0].url;
        const embedUrl = getYouTubeEmbedUrl(videoUrl);
        return (
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
      }

      case "image":
        return (
          <div className="p-4 bg-gray-100 rounded-lg h-full relative">
            <Image
              src={(block.data as MediaContent[])[0].url}
              alt="Vista previa"
              fill
              style={{ objectFit: "contain", borderRadius: "4px" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/300x150?text=Error+al+cargar+imagen";
                (e.currentTarget as HTMLImageElement).onerror = null;
              }}
            />
          </div>
        );
      case "audio": {
        const audio = (block.data as MediaContent[])[0];
        const audioEmbed = getAudioEmbedUrl(audio.url);
        return (
          <div className="p-4 bg-gray-100 rounded-lg h-full flex items-center justify-center">
            {audioEmbed ? (
              audioEmbed.type === 'direct' ? (
                <audio controls className="w-full max-w-md">
                  <source src={audioEmbed.url} />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              ) : (
                <iframe
                  className="w-full max-w-md rounded-md shadow-lg"
                  height="166"
                  src={audioEmbed.url}
                  title={audio.name}
                  frameBorder="0"
                  allow="autoplay"
                ></iframe>
              )
            ) : (
              <p className="text-sm text-gray-600">Audio no soportado: {audio.url}</p>
            )}
          </div>
        );
      }
      
      case "presentation": {
        const presentation = (block.data as MediaContent[])[0];
        const embedUrl = getCanvaEmbedUrl(presentation.url); 
        return (
          <div className="p-4 bg-gray-100 rounded-lg h-full flex items-center justify-center">
            {embedUrl ? (
              <iframe
                className="w-full h-full rounded-md shadow-lg"
                src={embedUrl}
                title={presentation.name}
                frameBorder="0"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            ) : (
              <p className="text-sm text-gray-600">Presentación no soportada: {presentation.url}</p>
            )}
          </div>
        );
      }
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg h-full">
            <p className="text-sm">{(block.data as MediaContent[])[0].name}</p>
            <p className="text-xs text-gray-500">({block.type})</p>
          </div>
        );
    }
  };

  return (
    <main
      className="bg-[#C9DDDC] min-h-screen w-full flex flex-col items-center justify-center p-8 gap-6"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <h1 className="text-3xl font-bold text-gray-800">Vista de Plantilla</h1>
        <TemplateBox3
          defaultLayout={layout}
          onLayoutChange={setLayout}
        >
          {contentBlocks.length === 3 ? (
            renderPreviewBlock(contentBlocks[0])
          ) : (
            <span className="text-gray-400">Add content here</span>
          )} 
          {contentBlocks.length === 3 ? (
            renderPreviewBlock(contentBlocks[1])
          ) : (
            <span className="text-gray-400">Add content here</span>
          )}
          {contentBlocks.length === 3 ? (
            renderPreviewBlock(contentBlocks[2])
          ) : (
            <span className="text-gray-400">Add content here</span>
          )}
        </TemplateBox3>
      <CustomButton
        text={saving ? "Guardando..." : "Save"}
        backgroundColor="#0B1D75"
        textColor="#fff"
        onClick={handleSaveTemplate}
        disabled={saving || contentBlocks.length < 3}
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
