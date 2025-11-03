"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import PyContent from "@/ui/components/organisms/pyContent";
import ModalBox from "../atoms/modalBox";
import Input from "../atoms/input";

export default function EdTeacherPage() {
  const router = useRouter();
  
  // Sin unidades por defecto
  const [unities, setUnities] = useState<Array<{ label: string; topics: { label: string }[] }>>([]);
  
  // Modales
  const [showUnityModal, setShowUnityModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  
  // Inputs
  const [newUnityName, setNewUnityName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  
  // Para saber a qué unidad agregar el topic
  const [selectedUnityIndex, setSelectedUnityIndex] = useState<number | null>(null);

  // ===== UNITY =====
  const handleAddUnity = () => {
    setShowUnityModal(true);
  };

  const handleSaveUnity = () => {
    if (newUnityName.trim() === "") return;
    
    const nextUnityNumber = unities.length + 1;
    const formattedName = newUnityName.trim().toLowerCase().startsWith("unity")
      ? newUnityName.trim()
      : `Unity ${nextUnityNumber}: ${newUnityName.trim()}`;

    const newUnity = { label: formattedName, topics: [] };
    setUnities([...unities, newUnity]);
    setNewUnityName("");
    setShowUnityModal(false);
  };

  const handleCancelUnity = () => {
    setShowUnityModal(false);
    setNewUnityName("");
  };

  // ===== TOPIC =====
  const handleAddTopic = (unityIndex: number) => {
    setSelectedUnityIndex(unityIndex);
    setShowTopicModal(true);
  };

  const handleSaveTopic = () => {
    if (newTopicName.trim() === "" || selectedUnityIndex === null) return;

    const updatedUnities = [...unities];
    const currentTopics = updatedUnities[selectedUnityIndex].topics;
    const nextTopicNumber = currentTopics.length + 1;
    
    // Formato: "1.1 - Topic Name"
    const unityNumber = selectedUnityIndex + 1;
    const formattedTopicName = `${unityNumber}.${nextTopicNumber} - ${newTopicName.trim()}`;

    updatedUnities[selectedUnityIndex].topics.push({ label: formattedTopicName });
    setUnities(updatedUnities);
    
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

  // ===== EDIT/DELETE (por implementar) =====
  const handleEdit = (type: "unity" | "topic") => {
    console.log('Botón Editar presionado para:', type);
  };

  const handleDelete = (type: "unity" | "topic") => {
    console.log('Botón Eliminar presionado para:', type);
  };

  return (
    <main className="flex-1 bg-[#C9DDDC] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <PyContent
          unities={unities}
          onAddUnity={handleAddUnity}
          onAddTopic={handleAddTopic}
          onEdit={handleEdit}
          onDelete={handleDelete}
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