"use client";

import React, { useState } from "react";
import PyContent from "@/ui/components/organisms/pyContent";

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

  const [unities] = useState(MOCK_UNITIES);

  const handleAddUnity = () => {
    console.log('Botón Añadir Unidad presionado');
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
    </main>
  );
};