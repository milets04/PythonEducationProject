'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/ui/components/atoms/button'; 

interface ContentButtonsProps {
  onAddContent?: () => void;
  onActualContent?: () => void;
  onStudents?: () => void;
}

const ContentButtons: React.FC<ContentButtonsProps> = ({
  onAddContent,
  onActualContent,
  onStudents,
}) => {
  const pathname = usePathname();
  
  // Determinar qué botón está seleccionado según la ruta actual
  const isAddContent = pathname === '/teacherPages/addContent';
  const isActualContent = pathname === '/teacherPages/actualContent';
  const isStudents = pathname === '/teacherPages/Students';

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <Button
        variant={isAddContent ? 'default' : 'outline'}
        size="lg"
        onClick={onAddContent}
        className="w-full"
      >
        Add Content
      </Button>

      <Button
        variant={isActualContent ? 'default' : 'outline'}
        size="lg"
        onClick={onActualContent}
        className="w-full"
      >
        Actual Content
      </Button>

      <Button
        variant={isStudents ? 'default' : 'outline'}
        size="lg"
        onClick={onStudents}
        className="w-full"
      >
        Students
      </Button>
    </div>
  );
};

export default ContentButtons;