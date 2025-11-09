"use client";

import React from "react";
import TemplateSelectorButton2 from "../atoms/templateSelectorButton2";

type LayoutName =
  | "vertical3"
  | "horizontal3"
  | "horizontal3-2"
  | "horizontal2-3"
  | "vertical2-3"
  | "vertical3-2";

interface TemplateBox3Props {
  defaultLayout?: LayoutName;
  onLayoutChange?: (layout: LayoutName) => void;
  children?: React.ReactNode[];
  title?: string;
}

const TemplateBox3: React.FC<TemplateBox3Props> = ({
  defaultLayout = "horizontal3",
  onLayoutChange,
  children = [],
  title = "Topic Template - 3 Sections",
}) => {
  const [layout, setLayout] = React.useState<LayoutName>(defaultLayout);

  const handleLayout = (l: LayoutName) => {
    setLayout(l);
    onLayoutChange?.(l);
  };

  const renderChild = (index: number) =>
    children[index] ?? <span className="text-gray-400">Add content here</span>;

  const renderGrid = () => {
    switch (layout) {
      case "vertical3":
        return (
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(0)}</div>
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(1)}</div>
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(2)}</div>
          </div>
        );

      case "horizontal3":
        return (
          <div className="flex flex-row gap-4 w-full h-full">
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(0)}</div>
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(1)}</div>
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(2)}</div>
          </div>
        );

      case "horizontal3-2":
        return (
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="h-1/2 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(0)}</div>
            <div className="flex flex-row gap-4 h-1/2">
              {/* dos columnas iguales 50% / 50% */}
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(1)}</div>
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(2)}</div>
            </div>
          </div>
        );

      case "horizontal2-3":
        return (
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex flex-row gap-4 h-1/2">
              {/* dos columnas iguales (50/50) */}
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(0)}</div>
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(1)}</div>
            </div>
            <div className="h-1/2 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(2)}</div>
          </div>
        );

      case "vertical2-3":
        return (
          <div className="flex flex-row gap-4 w-full h-full">
            <div className="flex flex-col gap-4 w-1/2 h-full">
              {/* dos filas iguales (50/50) en la columna izquierda */}
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(0)}</div>
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(1)}</div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(2)}</div>
          </div>
        );

      case "vertical3-2":
        return (
          <div className="flex flex-row gap-4 w-full h-full">
            <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(0)}</div>
            <div className="flex flex-col gap-4 w-1/2 h-full">
              {/* dos filas iguales (50/50) en la columna derecha */}
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(1)}</div>
              <div className="flex-1 bg-gray-100 rounded-md p-4 overflow-auto">{renderChild(2)}</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-6xl flex flex-col" style={{ fontFamily: "Roboto, sans-serif" }}>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">{title}</p>
      </div>

      <div className="flex-1 min-h-[360px]">{renderGrid()}</div>

      <div className="flex gap-3 mt-4 items-center">
        <TemplateSelectorButton2
          isActive={layout === "vertical3"}
          onClick={() => handleLayout("vertical3")}
          icon={
            <div className="w-4 h-4 border border-gray-500 flex flex-col">
              <div className="h-[1px] w-full bg-gray-500 mt-[4px]" />
              <div className="h-[1px] w-full bg-gray-500 mt-[3px]" />
            </div>
          }
        />

        <TemplateSelectorButton2
          isActive={layout === "horizontal3"}
          onClick={() => handleLayout("horizontal3")}
          icon={
            <div className="w-4 h-4 border border-gray-500 flex">
              <div className="w-[1px] h-full bg-gray-500 ml-[4px]" />
              <div className="w-[1px] h-full bg-gray-500 ml-[3px]" />
            </div>
          }
        />

        <TemplateSelectorButton2
          isActive={layout === "horizontal3-2"}
          onClick={() => handleLayout("horizontal3-2")}
          icon={
            <div className="w-5 h-4 relative">
              <div className="absolute top-0 left-0 right-0 h-1/3 border border-gray-500" />
              <div className="absolute bottom-0 left-0 w-1/2 h-2/3 border border-gray-500" />
              <div className="absolute bottom-0 right-0 w-1/2 h-2/3 border border-gray-500" />
            </div>
          }
        />
        <TemplateSelectorButton2
          isActive={layout === "horizontal2-3"}
          onClick={() => handleLayout("horizontal2-3")}
          icon={
            <div className="w-5 h-4 relative">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 border border-gray-500" />
              <div className="absolute top-0 right-0 w-1/2 h-1/2 border border-gray-500" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 border border-gray-500" />
            </div>
          }
        />
        <TemplateSelectorButton2
          isActive={layout === "vertical2-3"}
          onClick={() => handleLayout("vertical2-3")}
          icon={
            <div className="w-5 h-4 relative">
              <div className="absolute left-0 top-0 bottom-1/2 w-1/2 border border-gray-500" />
              <div className="absolute left-0 bottom-0 w-1/2 h-1/2 border border-gray-500" />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 border border-gray-500" />
            </div>
          }
        />
        <TemplateSelectorButton2
          isActive={layout === "vertical3-2"}
          onClick={() => handleLayout("vertical3-2")}
          icon={
            <div className="w-5 h-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1/2 border border-gray-500" />
              <div className="absolute right-0 top-0 w-1/2 h-1/2 border border-gray-500" />
              <div className="absolute right-0 bottom-0 w-1/2 h-1/2 border border-gray-500" />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default TemplateBox3;
