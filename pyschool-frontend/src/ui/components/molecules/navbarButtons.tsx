import React, { useState } from 'react';
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
  const [selected, setSelected] = useState<'add' | 'actual' | 'students'>('actual');

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <Button
        variant={selected === 'add' ? 'default' : 'outline'}
        size="lg"
        onClick={() => {
          setSelected('add');
          onAddContent?.();
        }}
        className="w-full"
      >
        Add Content
      </Button>

      <Button
        variant={selected === 'actual' ? 'default' : 'outline'}
        size="lg"
        onClick={() => {
          setSelected('actual');
          onActualContent?.();
        }}
        className="w-full"
      >
        Actual Content
      </Button>

      <Button
        variant={selected === 'students' ? 'default' : 'outline'}
        size="lg"
        onClick={() => {
          setSelected('students');
          onStudents?.();
        }}
        className="w-full"
      >
        Students
      </Button>
    </div>
  );
};

export default ContentButtons;