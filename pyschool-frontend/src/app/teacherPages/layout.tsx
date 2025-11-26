"use client"; 

import React from 'react';
import { useRouter } from 'next/navigation'; 
import Sidebar from '@/ui/components/organisms/sidebar'; 
import { API_URL } from '@/hoc/config';

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
    console.log('Configuration clicked');
    // TODO: Implementar configuración
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Llamar al endpoint de logout (opcional según la guía)
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Redirigir al login
      router.push('/signin');
      
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Aunque falle la petición, limpiar y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      router.push('/signin');
    }
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