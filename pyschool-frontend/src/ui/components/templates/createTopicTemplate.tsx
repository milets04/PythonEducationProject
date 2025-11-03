'use client';

import React from 'react';
import CreateTopicPage from '@/ui/components/organisms/createTopic'; 

const CreateTopicLayout: React.FC = () => {
  return (
      <div className="w-full bg-gradient-to-br bg-fondo overflow-y-auto">
        <CreateTopicPage />
      </div>
  );  
};

export default CreateTopicLayout;
