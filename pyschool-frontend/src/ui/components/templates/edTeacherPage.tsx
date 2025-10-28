"use client";

import React, { useState } from "react";
import PyContent from "@/ui/components/organisms/pyContent";

const MOCK_UNITIES = [
  { 
    label: "Unidad 1: Introducción a Python", 
    topics: [{ label: "1.1 - ¿Qué es Python?" }, { label: "1.2 - Instalación" }] 
  },
  { 
    label: "Unidad 2: Tipos de Datos", 
    topics: [{ label: "2.1 - Variables" }, { label: "2.2 - Números y Strings" }] 
  }
];

export default function EdTeacherPage() {

  const [unities, setUnities] = useState(MOCK_UNITIES);

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