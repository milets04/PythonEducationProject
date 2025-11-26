"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import PyContent from "@/ui/components/organisms/pyContent";
import ModalBox from "../atoms/modalBox";
import Input from "../atoms/input";
import { API_URL } from '@/hoc/config';

const API_BASE_URL = `${API_URL}/api`;

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

export interface Unit {
  id?: number;
  name: string;
  courseId: number;
  position?: number;
  topicCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitRequest {
  name: string;
  courseId: number;
  position?: number;
}

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

export const createUnit = async (data: CreateUnitRequest): Promise<Unit> => {
  const response = await fetch(`${API_BASE_URL}/units`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error creating unit');
  }

  const result = await response.json();
  return result.data;
};

export const getUnitsByCourse = async (courseId: number): Promise<Unit[]> => {
  const response = await fetch(`${API_BASE_URL}/units/course/${courseId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error fetching units');
  }

  const result = await response.json();
  return result.data;
};

export const deleteUnit = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/units/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error deleting unit');
  }
};

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

export const getTopicsByUnit = async (unitId: number): Promise<Topic[]> => {
  const response = await fetch(`${API_BASE_URL}/topics/unit/${unitId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error fetching topics');
  }

  const result = await response.json();
  return result.data;
};

export const deleteTopic = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error deleting topic');
  }
};

interface UnityWithTopics {
  id: number;
  label: string;
  topics: { id: number; label: string }[];
}

export default function EdTeacherPage() {
  const router = useRouter();
  const courseId = 1;
  
  const [unities, setUnities] = useState<UnityWithTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showUnityModal, setShowUnityModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  
  const [newUnityName, setNewUnityName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  
  const [selectedUnityIndex, setSelectedUnityIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCourseStructure();
  }, []);

  const loadCourseStructure = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const units: Unit[] = await getUnitsByCourse(courseId);
      
      const unitiesWithTopics: UnityWithTopics[] = await Promise.all(
        units.map(async (unit: Unit) => {
          const topics: Topic[] = await getTopicsByUnit(unit.id!);
          return {
            id: unit.id!,
            label: unit.name,
            topics: topics.map((topic: Topic) => ({
              id: topic.id!,
              label: topic.name
            }))
          };
        })
      );
      
      setUnities(unitiesWithTopics);
    } catch (err) {
      console.error('Error loading course structure:', err);
      setError('Error al cargar el contenido del curso');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnity = () => {
    setShowUnityModal(true);
  };

  const handleSaveUnity = async () => {
    if (newUnityName.trim() === "") return;
    
    try {
      const position = unities.length + 1;
      const unitName = newUnityName.trim().toLowerCase().startsWith("unity")
        ? newUnityName.trim()
        : `Unity ${position}: ${newUnityName.trim()}`;

      const newUnit = await createUnit({
        name: unitName,
        courseId: courseId,
        position: position
      });

      setUnities([...unities, {
        id: newUnit.id!,
        label: newUnit.name,
        topics: []
      }]);
      
      setNewUnityName("");
      setShowUnityModal(false);
    } catch (err) {
      console.error('Error creating unity:', err);
      alert('Error al crear la unidad');
    }
  };

  const handleCancelUnity = () => {
    setShowUnityModal(false);
    setNewUnityName("");
  };

  const handleDeleteUnity = async (unityIndex: number) => {
    const unity = unities[unityIndex];
    
    if (!confirm(`¿Estás seguro de eliminar "${unity.label}" y todos sus tópicos?`)) {
      return;
    }

    try {
      // Usando la función local
      await deleteUnit(unity.id);
      setUnities(unities.filter((_, index) => index !== unityIndex));
    } catch (err) {
      console.error('Error deleting unity:', err);
      alert('Error al eliminar la unidad');
    }
  };

  const handleAddTopic = (unityIndex: number) => {
    setSelectedUnityIndex(unityIndex);
    setShowTopicModal(true);
  };

  const handleSaveTopic = () => {
    if (newTopicName.trim() === "" || selectedUnityIndex === null) return;

    const unity = unities[selectedUnityIndex];
    const topicCount = unity.topics.length + 1;
    const unityNumber = selectedUnityIndex + 1;
    const formattedTopicName = `${unityNumber}.${topicCount} - ${newTopicName.trim()}`;

    // Guardar información del tópico en localStorage para usar en createTopic
    localStorage.setItem('newTopic', JSON.stringify({
      name: formattedTopicName,
      unitId: unity.id,
      unitIndex: selectedUnityIndex
    }));
    
    setNewTopicName("");
    setShowTopicModal(false);
    setSelectedUnityIndex(null);

    // Redirigir a createTopic
    router.push('/teacherPages/createTopic');
  };

  const handleCancelTopic = () => {
    setShowTopicModal(false);
    setNewTopicName("");
    setSelectedUnityIndex(null);
  };

  const handleDeleteTopic = async (unityIndex: number, topicIndex: number) => {
    const unity = unities[unityIndex];
    const topic = unity.topics[topicIndex];
    
    if (!confirm(`¿Estás seguro de eliminar "${topic.label}"?`)) {
      return;
    }

    try {
      // Usando la función local
      await deleteTopic(topic.id);
      
      const updatedUnities = [...unities];
      updatedUnities[unityIndex].topics = updatedUnities[unityIndex].topics.filter(
        (_, index) => index !== topicIndex
      );
      setUnities(updatedUnities);
    } catch (err) {
      console.error('Error deleting topic:', err);
      alert('Error al eliminar el tópico');
    }
  };

  // ===== EDIT (por implementar) =====
  const handleEdit = (type: "unity" | "topic") => {
    console.log('Botón Editar presionado para:', type);
    // TODO: Implementar edición
  };

  if (loading) {
    return (
      <main className="flex-1 bg-[#C9DDDC] p-8 flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-[#C9DDDC] p-8 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#C9DDDC] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <PyContent
          unities={unities}
          onAddUnity={handleAddUnity}
          onAddTopic={handleAddTopic}
          onEdit={handleEdit}
          // 3. AQUÍ ESTÁ LA CORRECCIÓN: 'onDelete' ahora es 'onDeleteUnity'
          onDeleteUnity={handleDeleteUnity}
          onDeleteTopic={handleDeleteTopic}
        />
      </div>

      {/* Modal para Unidad */}
      <ModalBox
        title="Enter the unity name"
        isOpen={showUnityModal}
        onClose={handleCancelUnity}
        onConfirm={handleSaveUnity}
        confirmText="Save"
        cancelText="Cancel"
      >
        <Input
          id="unity-name"
          value={newUnityName}
          onChange={(e) => setNewUnityName(e.target.value)}
          placeholder="Write unity name..."
        />
      </ModalBox>

      {/* Modal para Tópico */}
      <ModalBox
        title="Enter the topic name"
        isOpen={showTopicModal}
        onClose={handleCancelTopic}
        onConfirm={handleSaveTopic}
        confirmText="Save"
        cancelText="Cancel"
      >
        <Input
          id="topic-name"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          placeholder="Write topic name..."
        />
      </ModalBox>
    </main>
  );
}