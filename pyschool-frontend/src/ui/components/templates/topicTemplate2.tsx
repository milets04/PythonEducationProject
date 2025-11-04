"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Importar useRouter
import TemplateBox2 from "../molecules/templateBox2";
import CustomButton from "../atoms/btnOthers";

// =================================================================
// 2. CÓDIGO DE API INTEGRADO (copiado de CreateTopic.tsx)
// =================================================================

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

// =================================================================
// 3. LÓGICA DEL COMPONENTE ACTUALIZADA
// =================================================================

export default function TopicTemplate2() {
  const router = useRouter();
  const [layout, setLayout] = useState<"vertical2" | "horizontal2">("vertical2");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Esta función se ejecuta al pulsar "Save".
   * Lee los datos del tópico de localStorage,
   * añade la plantilla seleccionada y llama a la API.
   */
  const handleSaveTemplate = async () => {
    setSaving(true);
    setError(null);

    try {
      // 1. Obtener los datos del tópico guardados desde CreateTopic
      const storedData = localStorage.getItem('topicData');
      if (!storedData) {
        throw new Error("No se encontraron datos del tópico. Redirigiendo...");
      }
      
      // 2. Convertir los datos de JSON a objeto
      // (Omitimos 'templateName' porque lo vamos a añadir nosotros)
      const topicData = JSON.parse(storedData) as Omit<CreateTopicRequest, 'templateName'>;

      // 3. Llamar a la API 'createTopic' con todos los datos
      await createTopic({
        ...topicData, // name, unitId, subtitles, videos, etc.
        templateName: layout, // Añadimos la plantilla seleccionada ('vertical2' o 'horizontal2')
      });

      // 4. Limpiar localStorage y redirigir
      localStorage.removeItem('topicData');
      localStorage.removeItem('newTopic'); // Limpiar ambos por si acaso
      
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
    
  return (
    <main
      className="bg-[#C9DDDC] min-h-screen w-full flex flex-col items-center justify-center p-8 gap-6"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {/* Mostrar error si lo hay */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      <TemplateBox2 defaultLayout={layout} onLayoutChange={setLayout} />

      <CustomButton
        text={saving ? "Guardando..." : "Save"} // Texto dinámico
        backgroundColor="#0B1D75"
        textColor="#fff"
        onClick={handleSaveTemplate} // 5. Conectar la nueva función
        disabled={saving} // 6. Deshabilitar el botón mientras guarda
        className="px-8 py-2 text-sm"
      />
    </main>
  );
}