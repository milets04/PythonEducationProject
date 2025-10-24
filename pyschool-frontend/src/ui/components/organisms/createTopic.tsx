'use client';

import React, { useState } from 'react';
import ContentInput from '@/ui/components/atoms/contentInput';
import UploadInput from '@/ui/components/molecules/uploadInput';
import { Button } from '@/ui/components/atoms/button';

const CreateTopic: React.FC = () => {
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');

  const handleUpload = (file: File | null) => {
    console.log('Archivo seleccionado:', file);
  };

  return (
    <div className="min-h-screen bg-[#c6d8d7] flex justify-center items-center p-4">
      <div className="bg-[#c6d8d7] w-full max-w-3xl p-6 rounded-lg space-y-5">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Create Topic</h1>

        {/* Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <ContentInput
            label="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="flex-1"
            placeholder="Enter subtitle"
          />
          <Button className="bg-indigo-900 text-white hover:bg-indigo-700">Add +</Button>
        </div>

        {/* Description */}
        <ContentInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="h-24"
        />

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
