'use client';

import React from 'react';
import Sidebar from '@/ui/components/organisms/sidebar';
import CreateTopicPage from '@/ui/components/organisms/createTopic'; 

const CreateTopicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 text-white flex-shrink-0 ">
        <Sidebar/>
      </aside>

      {/* Contenido principal */}
      <main className="w-full bg-gradient-to-br bg-fondo overflow-y-auto">
        <CreateTopicPage />
      </main>
    </div>
  );
};

export default CreateTopicLayout;
