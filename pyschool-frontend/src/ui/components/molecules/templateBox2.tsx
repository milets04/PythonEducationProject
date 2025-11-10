"use client";

import React, { useState } from "react";
import TemplateSelectorButton2 from "../atoms/templateSelectorButton2";

interface TemplateBox2Props {
  defaultLayout?: "vertical2" | "horizontal2";
  onLayoutChange?: (layout: "vertical2" | "horizontal2") => void;
  children?: React.ReactNode[];
}

const TemplateBox2: React.FC<TemplateBox2Props> = ({
  defaultLayout = "vertical2", // Puedes dejar el default que prefieras
  onLayoutChange,
  children = [],
}) => {
  const [layout, setLayout] = useState<"vertical2" | "horizontal2">(
    defaultLayout
  );

  const handleLayoutChange = (newLayout: "vertical2" | "horizontal2") => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

  return (
    <div
      className="bg-white rounded-xl p-4 md:p-6 shadow-lg w-full h-full flex flex-col"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <div
        className={`bg-gray-200 rounded-md relative overflow-hidden flex ${
          // CORRECCIÓN 1: 'horizontal2' debe ser 'flex-row' (columnas)
          layout === "horizontal2" ? "flex-row" : "flex-col"
        } transition-all duration-300 p-3 md:p-4 gap-3 md:gap-4 flex-1 min-h-0`}
      >
        <div className="flex-1 bg-gray-100 rounded-md overflow-hidden min-w-0 min-h-0">
          {children[0] ?? (
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-400">Add content here</span>
            </div>
          )}
        </div>

        <div
          className={`absolute bg-gray-400 ${
            // CORRECCIÓN 2: El separador vertical es para 'horizontal2'
            layout === "horizontal2"
              ? "w-[2px] h-full left-1/2" // Separador vertical
              : "h-[2px] w-full top-1/2" // Separador horizontal
          }`}
        />

        <div className="flex-1 bg-gray-100 rounded-md overflow-hidden min-w-0 min-h-0">
          {children[1] ?? (
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-400">Add content here</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-3 md:mt-4 flex-shrink-0">
        {/* CORRECCIÓN 3: Este botón es para 'horizontal2' */}
        <TemplateSelectorButton2
          isActive={layout === "horizontal2"}
          onClick={() => handleLayoutChange("horizontal2")}
          icon={
            <div className="w-4 h-4 border border-gray-500 flex">
              <div className="w-[1px] h-full bg-gray-500 mx-auto" />
            </div>
          }
        />
        {/* CORRECCIÓN 4: Este botón es para 'vertical2' */}
        <TemplateSelectorButton2
          isActive={layout === "vertical2"}
          onClick={() => handleLayoutChange("vertical2")}
          icon={
            <div className="w-4 h-4 border border-gray-500 flex flex-col">
              <div className="h-[1px] w-full bg-gray-500 my-auto" />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default TemplateBox2;