"use client";

import React from "react";
import Sidebar from "@/ui/components/organisms/sidebar";
import PyContent from "@/ui/components/organisms/pyContent";

interface EdTeacherPageProps {
  unities: {
    label: string;
    topics: { label: string }[];
  }[];
  onAddContent?: () => void;
  onActualContent?: () => void;
  onStudents?: () => void;
  onConfiguration?: () => void;
  onLogout?: () => void;
  onAddUnity?: () => void;
  onAddTopic?: () => void;
  onEdit?: (type: "unity" | "topic") => void;
  onDelete?: (type: "unity" | "topic") => void;
}

const EdTeacherPage: React.FC<EdTeacherPageProps> = ({
  unities,
  onAddContent,
  onActualContent,
  onStudents,
  onConfiguration,
  onLogout,
  onAddUnity,
  onAddTopic,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        onAddContent={onAddContent}
        onActualContent={onActualContent}
        onStudents={onStudents}
        onConfiguration={onConfiguration}
        onLogout={onLogout}
      />
      <main className="flex-1 bg-[#C9DDDC] p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <PyContent
            unities={unities}
            onAddUnity={onAddUnity}
            onAddTopic={onAddTopic}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </main>
    </div>
  );
};

export default EdTeacherPage;
