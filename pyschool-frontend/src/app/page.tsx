"use client";
import LandingpageTemplate from "@/ui/components/templates/landingpageTemplate";
import React, { useState } from 'react';
import ContentButtons from "@/ui/components/molecules/navbarButtons";

export default function Page() {
  
  return (
    <div>
      <ContentButtons
        onAddContent={() => console.log('Add Content clicked')}
        onActualContent={() => console.log('Actual Content clicked')}
        onStudents={() => console.log('Students clicked')}
      />
      <LandingpageTemplate />
    </div>
  );
}
