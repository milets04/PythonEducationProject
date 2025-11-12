"use client";

import React from "react";
import CoverText from "../atoms/coverText";
import CoverDescriptionText from "../atoms/coverDescriptionText";
import ContentEdTeacher from "../molecules/contentEdTeacher";

interface PyContentProps {
  courseTitle?: string;
  contentTitle?: string;
  unities: {
    id?: number;
    label: string;
    topics: { id?: number; label: string }[];
  }[];
  onAddUnity?: () => void;
  onAddTopic?: (unityIndex: number) => void;
  onEdit?: (type: "unity" | "topic") => void;
  // 1. Renombramos 'onDelete' a 'onDeleteUnity' para claridad
  onDeleteUnity?: (unityIndex: number) => void; 
  onDeleteTopic?: (unityIndex: number, topicIndex: number) => void;
}

const PyContent: React.FC<PyContentProps> = ({
  courseTitle = "Python Course",
  contentTitle = "Content:",
  unities = [],
  onAddUnity,
  onAddTopic,
  onEdit,
  // 2. Usamos la prop renombrada
  onDeleteUnity, 
  onDeleteTopic,
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-[#C9DDDC] p-6 rounded-lg">
      <div className="mb-2">
        <CoverText
          text={courseTitle}
          size="medium"
          className="text-left mb-1"
        />
      </div>
      <div className="mb-3">
        <CoverDescriptionText
          text={contentTitle}
          size="small"
          className="text-left"
        />
      </div>
      <div className="flex-1">
        <ContentEdTeacher
          unities={unities}
          onAddUnity={onAddUnity}
          onAddTopic={onAddTopic}
          onEdit={onEdit}
          onDeleteUnity={onDeleteUnity} 
          onDeleteTopic={onDeleteTopic}
        />
      </div>
    </div>
  );
};

export default PyContent;