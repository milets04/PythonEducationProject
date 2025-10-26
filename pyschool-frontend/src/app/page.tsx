"use client";
import LandingpageTemplate from "@/ui/components/templates/landingpageTemplate";
import React, { useState } from 'react';
import UnitySelector, { UnityOption } from "@/ui/components/atoms/unitySelector";

export default function Page() {
  const MOCK_UNITS: UnityOption[] = [
    { value: "unit-1", label: "Unity 1" },
    { value: "unit-2", label: "Unity 2" },
    { value: "unit-3", label: "Unity 3" },
    { value: "unit-4", label: "Unity 4: Final" }
  ];
  const [selectedValue, setSelectedValue] = useState<string>("unit-2");

  const handleSelection = (newValue: string) => {
    console.log("El nuevo valor seleccionado es:", newValue);
    setSelectedValue(newValue);
  };
  
  return (
    <div>
      <UnitySelector
        value={selectedValue}     
        options={MOCK_UNITS}     
        onChange={handleSelection}  
      />
      <LandingpageTemplate />
    </div>
  );
}
