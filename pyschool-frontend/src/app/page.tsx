"use client";

import React from 'react';
import EdTeacherPage from '@/ui/components/templates/edTeacherPage';
export default function Page() {
  const mockData = [
    {
      label: "First Unity",
      topics: [
        { label: "First Topic - First Unity" },
        { label: "Second Topic - First Unity" },
        { label: "Third Topic - First Unity" },
      ],
    },
  ];

  
  return (
     <EdTeacherPage
      unities={mockData}
      onAddContent={() => alert("Add Content")}
      onActualContent={() => alert("Actual Content")}
      onStudents={() => alert("Students")}
      onConfiguration={() => alert("Configuration")}
      onLogout={() => alert("Logout")}
      onAddUnity={() => alert("Add Unity")}
      onAddTopic={() => alert("Add Topic")}
      onEdit={(type) => alert(`Edit ${type}`)}
      onDelete={(type) => alert(`Delete ${type}`)}
    />
  );
}
