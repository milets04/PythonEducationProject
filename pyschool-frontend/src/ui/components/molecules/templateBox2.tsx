"use client";

import React, { useState } from "react";
import TemplateSelectorButton2 from "../atoms/templateSelectorButton2";

interface TemplateBox2Props {
 defaultLayout?: "vertical2" | "horizontal2";
 onLayoutChange?: (layout: "vertical2" | "horizontal2") => void;
 children?: React.ReactNode[];
}

const TemplateBox2: React.FC<TemplateBox2Props> = ({
 defaultLayout = "vertical2",
 onLayoutChange,
 children = [],
}) => {
 const [layout, setLayout] = useState<"vertical2" | "horizontal2">(defaultLayout);

 const handleLayoutChange = (newLayout: "vertical2" | "horizontal2") => {
  setLayout(newLayout);
  onLayoutChange?.(newLayout);
 };

 return (
  <div
   className="bg-white rounded-xl p-6 shadow-lg w-full max-w-6xl flex flex-col justify-between"
   style={{ fontFamily: "Roboto, sans-serif" }}
  >
   <div
    className={`bg-gray-200 rounded-md relative overflow-hidden flex ${
     layout === "vertical2" ? "flex-row" : "flex-col"
    } transition-all duration-300 p-4 gap-4`}
   >
    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md overflow-auto">
     {children[0] ?? <span className="text-gray-400">Add content here</span>}
    </div>

    <div
     className={`absolute bg-gray-400 ${
      layout === "vertical2"
      ? "w-[2px] h-full left-1/2"
       : "h-[2px] w-full top-1/2"
     }`}
    />

    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md overflow-auto">
     {children[1] ?? <span className="text-gray-400">Add content here</span>}
    </div>
   </div>

   <div className="flex gap-3 mt-4">
    <TemplateSelectorButton2
     isActive={layout === "vertical2"}
     onClick={() => handleLayoutChange("vertical2")}
     icon={
      <div className="w-4 h-4 border border-gray-500 flex">
       <div className="w-[1px] h-full bg-gray-500 mx-auto" />
      </div>
     }
    />
     <TemplateSelectorButton2
     isActive={layout === "horizontal2"}
     onClick={() => handleLayoutChange("horizontal2")}
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