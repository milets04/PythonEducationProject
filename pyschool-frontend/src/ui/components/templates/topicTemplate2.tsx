"use client";

import React, { useState } from "react";
import TemplateBox2 from "../molecules/templateBox2";
import CustomButton from "../atoms/btnOthers";

export default function TopicTemplate2() {
  const [layout, setLayout] = useState<"vertical2" | "horizontal2">("vertical2");

  return (
    <main
      className="bg-[#C9DDDC] min-h-screen w-full flex flex-col items-center justify-center p-8 gap-6"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <TemplateBox2 defaultLayout={layout} onLayoutChange={setLayout} />

      <CustomButton
        text="Save"
        backgroundColor="#0B1D75"
        textColor="#fff"
        onClick={() => console.log("Saved template:", layout)}
        className="px-8 py-2 text-sm"
      />
    </main>
  );
}
