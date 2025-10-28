'use client';

import React, { useState } from 'react';
import ContentInput from '@/ui/components/atoms/contentInput';
import Textarea from '../atoms/textInput';
import UploadInput from '@/ui/components/molecules/uploadInput';
import { Button } from '@/ui/components/atoms/button';

interface TopicSection {
  id: number;
  subtitle: string;
  description: string;
}

const CreateTopic: React.FC = () => {
  const [sections, setSections] = useState<TopicSection[]>([
    { id: Date.now(), subtitle: '', description: '' },
  ]);

  const handleChange = (
    id: number,
    field: keyof TopicSection,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now(), subtitle: '', description: '' },
    ]);
  };

  const handleRemoveSection = (id: number) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpload = (file: File | null) => {
    console.log('Archivo seleccionado:', file);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br bg-fondo flex justify-center items-center p-4">
      <div className=" bg-gradient-to-br bg-fondo w-full max-w-3xl p-6 rounded-lg space-y-5">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Create Topic</h1>

        {sections.map((section, index) => (
          <div key={section.id} className="space-y-3 border-b border-gray-300 pb-4">
            <div className="flex flex-col md:flex-row md:items-end gap-2">
              <ContentInput
                label={`Subtitle ${index + 1}`}
                value={section.subtitle}
                onChange={(e) =>
                  handleChange(section.id, 'subtitle', e.target.value)
                }
                className="flex-1"
                placeholder="Enter subtitle"
              />
              {/* Botón de agregar o eliminar */}
              {index === sections.length - 1 ? (
                <Button
                  variant="default"
                  onClick={handleAddSection}
                  className="bg-[#0B1D75] text-white hover:bg-[#09175e]"
                >
                  Add +
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleRemoveSection(section.id)}
                  className="bg-[#485C6D] text-white hover:bg-gray-700"
                >
                  Remove
                </Button>
              )}
            </div>

            <Textarea
              label={`Description ${index + 1}`}
              value={section.description}
              onChange={(e) =>
                handleChange(section.id, 'description', e.target.value)
              }
              placeholder="Enter description"
              rows={5}
            />
          </div>
        ))}

        {/* Upload sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UploadInput label="Videos" onUpload={handleUpload} />
          <UploadInput label="Images" onUpload={handleUpload} />
          <UploadInput label="Audio" onUpload={handleUpload} />
          <UploadInput label="Presentation" onUpload={handleUpload} />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button className="bg-indigo-900/80 text-white hover:bg-indigo-900">Cancel</Button>
          <Button className="bg-indigo-900 text-white hover:bg-indigo-700">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTopic;
