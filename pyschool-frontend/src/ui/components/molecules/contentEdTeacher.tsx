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
  onAddTopic?: (unityIndex: number) => void;
  onEdit?: (type: "unity" | "topic") => void;
  // 1. Reemplazamos 'onDelete' con dos props específicas
  onDeleteUnity?: (unityIndex: number) => void;
  onDeleteTopic?: (unityIndex: number, topicIndex: number) => void;
}

const ContentEdTeacher: React.FC<ContentEdTeacherProps> = ({
  unities = [],
  onAddUnity,
  onAddTopic,
  onEdit,
  // 2. Recibimos las nuevas props
  onDeleteUnity,
  onDeleteTopic,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 max-w-4xl mx-auto">
      {/* 'index' aquí es el 'unityIndex' */}
      {unities.map((unity, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <DropDownMenu
              label={unity.label}
              // 3. Añadimos 'topicIndex' al map para poder pasarlo
              items={unity.topics.map((topic, topicIndex) => ({
                label: topic.label,
                onClick: () => onEdit?.("topic"),
                actions: (
                  <IconsEdTeacher
                    onEdit={() => onEdit?.("topic")}
                    // 4. Usamos 'onDeleteTopic' con ambos índices
                    onDelete={() => onDeleteTopic?.(index, topicIndex)}
                    classNameEdit="text-blue-900"
                    classNameDelete="text-blue-900"
                  />
                ),
              }))}
              onAdd={() => onAddTopic?.(index)}
            />
            {/* Íconos para cada unidad */}
            <IconsEdTeacher
              onEdit={() => onEdit?.("unity")}
              // 5. Usamos 'onDeleteUnity' con el 'unityIndex'
              onDelete={() => onDeleteUnity?.(index)}
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
      </div>
    </div>
  );
};

export default ContentEdTeacher;