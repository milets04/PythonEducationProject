"use client";
import LandingpageTemplate from "@/ui/components/templates/landingpageTemplate";
import React, { useState } from 'react';
import Sidebar from '@/ui/components/organisms/sidebar';

export default function Page() {
  
  return (
    <div>
      <Sidebar
        onAddContent={() => console.log('Add Content clicked')}
        onActualContent={() => console.log('Actual Content clicked')}
        onStudents={() => console.log('Students clicked')}
        onConfiguration={() => console.log('Configuration clicked')}
        onLogout={() => console.log('Logout clicked')}
      />
      <LandingpageTemplate />
    </div>
  );
}
