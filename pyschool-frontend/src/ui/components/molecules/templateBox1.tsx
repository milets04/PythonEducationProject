"use client";

import React from "react";
import TemplateSelectorButton2 from "../atoms/templateSelectorButton2";

interface TemplateBox1Props {
  defaultLayout?: "grid1";
  onLayoutChange?: (layout: "grid1") => void;
  children?: React.ReactNode;
}

const TemplateBox1: React.FC<TemplateBox1Props> = ({
  defaultLayout = "grid1",
  onLayoutChange,
  children,
}) => {
  const [layout, setLayout] = React.useState<"grid1">(defaultLayout);

  const handleLayoutChange = (newLayout: "grid1") => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

 return (
  <div
    className="bg-white rounded-xl p-6 shadow-lg w-full max-w-5xl mx-auto flex flex-col justify-between"
    style={{ fontFamily: "Roboto, sans-serif" }}
  >
    <div className="bg-gray-200 rounded-md flex flex-col items-center justify-center p-6 min-h-[220px]">
      <div className="w-full bg-gray-100 rounded-md overflow-hidden flex justify-center p-4 min-h-[120px]">
        <div className="w-full">
          {children ?? <span className="text-gray-400">Add content here</span>}
        </div>
      </div>
    </div>

    <div className="flex items-center mt-4">
      <div className="ml-1">
        <TemplateSelectorButton2
          isActive={layout === "grid1"}
          onClick={() => handleLayoutChange("grid1")}
          icon={
            <div className="w-5 h-5 border border-gray-500 flex items-center justify-center">
              <div className="w-[60%] h-[1px] bg-gray-500" />
            </div>
          }
        />
      </div>
    </div>
  </div>
);
}

export default TemplateBox1;
