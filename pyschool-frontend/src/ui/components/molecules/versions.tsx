import React from 'react';

interface VersionProps {
  versionNumber: number;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return "Invalid Date"; 
  }
};

const Version: React.FC<VersionProps> = ({ versionNumber, createdAt }) => {
  
  const formattedDate = formatDate(createdAt);

  return (
    <div className="mb-3 border-b border-gray-200 pb-3 last:mb-0 last:border-b-0">
      
      <p className="text-sm text-gray-800 font-bold">
        Version{versionNumber} 
      </p>
      <p className="text-sm font-medium text-gray-800">
        {formattedDate}
      </p>

      <p className="text-xs text-blue-500 italic">
        // url
      </p>
    </div>
  );
};

export default Version;