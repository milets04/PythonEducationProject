"use client";

import React from "react";
import DropDownMenu from "../atoms/dropDownMenu";
import IconsEdTeacher from "../atoms/iconsEdTeacher";

interface ContentEdTeacherProps {
  unities: {
    label: string;
    topics: { label: string }[];
  }[];
  onAddUnity?: () => void;
  onAddTopic?: () => void;
  onEdit?: (type: "unity" | "topic") => void;
  onDelete?: (type: "unity" | "topic") => void;
}

const ContentEdTeacher: React.FC<ContentEdTeacherProps> = ({
  unities = [],
  onAddUnity,
  onAddTopic,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 max-w-4xl mx-auto">
      {unities.map((unity, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <DropDownMenu
              label={unity.label}
              items={unity.topics.map((topic) => ({
                label: topic.label,
              }))}
              onAdd={onAddTopic}
            />
            <IconsEdTeacher
              onEdit={() => onEdit?.("unity")}
              onDelete={() => onDelete?.("unity")}
              classNameEdit="text-blue-900"
              classNameDelete="text-blue-900"
            />
          </div>
        </div>
      ))}
      <div className="mt-3 flex flex-col gap-1">
        <button
          onClick={onAddUnity}
          className="text-[#2F7CBB] hover:underline text-sm text-left"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          + Unity
        </button>
        <button
          onClick={onAddTopic}
          className="text-[#2F7CBB] hover:underline text-sm text-left ml-4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          + Topic
        </button>
      </div>
    </div>
  );
};

export default ContentEdTeacher;
