"use client";

import React, { useState } from "react";
import PyContent from "@/ui/components/organisms/pyContent";
import ModalBox from "../atoms/modalBox";
import Input from "../atoms/input";

const MOCK_UNITIES = [
  { 
    label: "Unity 1: Introduction to Python", 
    topics: [{ label: "1.1 - What is Python?" }, { label: "1.2 - Installation" }] 
  },
  { 
    label: "Unity 2: Data Types", 
    topics: [{ label: "2.1 - Variables" }, { label: "2.2 - Numbers and Strings" }] 
  }
];

export default function EdTeacherPage() {

  const [unities, setUnities] = useState(MOCK_UNITIES);
  const [showModal, setShowModal] = useState(false);
  const [newUnityName, setNewUnityName] = useState("");

  const handleAddUnity = () => {
    setShowModal(true);
  };

  const handleSaveUnity = () => {
    if (newUnityName.trim() === "") return;
    const nextUnityNumber = unities.length +1; //calcula el num de la sig unidad
    const formattedName = newUnityName.trim().toLowerCase().startsWith("unity")
    ? newUnityName.trim()
    : `Unity ${nextUnityNumber}: ${newUnityName.trim()}`;

    const newUnity = { label: formattedName, topics: [] };
    setUnities([...unities, newUnity]);
    setNewUnityName("");
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewUnityName("");
  };

  const handleAddTopic = () => {
    console.log('Botón Añadir Tema presionado');
  };

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

      <ModalBox
      title="Enter the unity name"
      isOpen={showModal}
      onClose={handleCancel}
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
    </main>
  );
};