import React from 'react';
import Title from '../atoms/title'; 
import Version from '../molecules/versions'; 

export interface TopicVersion {
  id: number;
  createdAt: string;
}

interface LogsProps {
  versions: TopicVersion[];
}

const Logs: React.FC<LogsProps> = ({ versions = [] }) => {
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="w-full max-w-2xs rounded-lg border border-gray-300 bg-white shadow-lg">
      <div className="border-b border-gray-200 px-4 py-3">
        <Title text="Logs"/> 
      </div>
      <div className="overflow-y-auto p-4" style={{ maxHeight: '350px' }}>
        {sortedVersions.length > 0 ? (
          sortedVersions.map((version, index) => (
            <Version
              key={version.id}
              versionNumber={index + 1}             
              createdAt={version.createdAt}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No se encontró historial de versiones.</p>
        )}
      </div>
    </div>
  );
};

export default Logs;