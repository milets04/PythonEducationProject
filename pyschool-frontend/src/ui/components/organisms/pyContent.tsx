"use client";

import React from "react";
import CoverText from "../atoms/coverText";
import CoverDescriptionText from "../atoms/coverDescriptionText";
import ContentEdTeacher from "../molecules/contentEdTeacher";

interface PyContentProps {
  courseTitle?: string;
  contentTitle?: string;
  unities: {
    label: string;
    topics: { label: string }[];
  }[];
  onAddUnity?: () => void;
  onAddTopic?: () => void;
  onEdit?: (type: "unity" | "topic") => void;
  onDelete?: (type: "unity" | "topic") => void;
}

const PyContent: React.FC<PyContentProps> = ({
  courseTitle = "Python Course",
  contentTitle = "Content:",
  unities = [],
  onAddUnity,
  onAddTopic,
  onEdit,
  onDelete,
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
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default PyContent;
