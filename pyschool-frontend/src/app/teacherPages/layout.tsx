"use client"; 

import React from 'react';
import { useRouter } from 'next/navigation'; 
import Sidebar from '@/ui/components/organisms/sidebar'; 

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleAddContent = () => {
    router.push('/teacherPages/addContent');
  };

  const handleActualContent = () => {
    router.push('/teacherPages/actualContent');
  };

  const handleStudents = () => {
    router.push('/teacherPages/Students');
  };

  const handleConfiguration = () => {
    // router.push('/teacherPages/configuration');
    console.log('Configuration clicked');
  };

  const handleLogout = () => {
    // router.push('/');
    console.log('Logout clicked');
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onAddContent={handleAddContent}
        onActualContent={handleActualContent}
        onStudents={handleStudents}
        onConfiguration={handleConfiguration}
        onLogout={handleLogout}
      />
      
      {children}
    </div>
  );
}