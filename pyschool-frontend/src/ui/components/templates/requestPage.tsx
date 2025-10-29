"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackgroundClouds from "../atoms/backgroundClouds";
import Table from "../molecules/table";
import { Button } from "../atoms/button";
import Title from "../atoms/title";

interface PendingUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface UserWithSelection extends PendingUser {
  isSelected: boolean;
  newRoleId: number; // El rol que el admin quiere asignar
}

const RequestPageTemplate: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Verificar que el usuario sea admin al cargar
  useEffect(() => {
    checkAdminAccess();
    fetchPendingUsers();
  }, []);

  // Verificar acceso de administrador
  const checkAdminAccess = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Verificar rol del usuario actual
    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || data.data.role !== "administrator") {
          // No es administrador, redirigir
          router.push("/unauthorized");
        }
      })
      .catch(() => {
        router.push("/login");
      });
  };

  // Obtener usuarios pendientes
  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/users/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Agregar campos de selección y rol por defecto
        const usersWithSelection: UserWithSelection[] = data.data.map((user: PendingUser) => ({
          ...user,
          isSelected: false,
          newRoleId: 1, // Por defecto estudiante
        }));
        setUsers(usersWithSelection);
      } else {
        setError(data.message || "Error al cargar usuarios");
      }
    } catch (err) {
      setError("Error de conexión al servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle selección de usuario
  const handleToggleSelection = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isSelected: !user.isSelected } : user
      )
    );
  };

  // Cambiar rol de un usuario
  const handleRoleChange = (userId: number, newRoleId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, newRoleId } : user
      )
    );
  };

  // Guardar (aprobar todos los usuarios visibles)
  const handleSave = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Preparar array de aprobaciones
      const approvals = users.map((user) => ({
        userId: user.id,
        roleId: user.newRoleId,
      }));

      const response = await fetch("http://localhost:5000/api/auth/users/bulk-approve", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approvals }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          ` ${data.data.approved.length} usuarios aprobados exitosamente`
        );
        // Recargar la lista
        fetchPendingUsers();
      } else {
        alert("Error al aprobar usuarios");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al servidor");
    } finally {
      setProcessing(false);
    }
  };

  // Eliminar (rechazar usuarios seleccionados)
  const handleDelete = async () => {
    const selectedUsers = users.filter((user) => user.isSelected);

    if (selectedUsers.length === 0) {
      alert("No hay usuarios seleccionados");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de rechazar ${selectedUsers.length} usuario(s)?`
    );

    if (!confirmDelete) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const userIds = selectedUsers.map((user) => user.id);

      const response = await fetch("http://localhost:5000/api/auth/users/bulk-reject", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          ` ${data.data.rejected.length} usuarios rechazados exitosamente`
        );
        // Recargar la lista
        fetchPendingUsers();
      } else {
        alert("Error al rechazar usuarios");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al servidor");
    } finally {
      setProcessing(false);
    }
  };

  // Verificar si hay usuarios seleccionados
  const hasSelectedUsers = users.some((user) => user.isSelected);

  if (loading) {
    return (
      <main className="relative w-full min-h-screen overflow-hidden bg-transparent flex items-center justify-center">
        <BackgroundClouds />
        <div className="relative z-10">
          <p className="text-xl text-gray-700">Cargando usuarios pendientes...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative w-full min-h-screen overflow-hidden bg-transparent flex items-center justify-center">
        <BackgroundClouds />
        <div className="relative z-10">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-transparent flex flex-col">
      <BackgroundClouds />
      <div className="relative z-10 flex flex-col grow">
        <section className="grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
          <Title
            text="Teacher requests"
            className="text-gray-700 justify-items-start mb-3"
          />
          
          {users.length === 0 ? (
            <div className="max-w-7xl w-full bg-white rounded-2xl shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg">
                No hay usuarios pendientes de aprobación
              </p>
            </div>
          ) : (
            <>
              <div className="max-w-7xl w-full">
                <Table
                  data={users}
                  onToggleSelection={handleToggleSelection}
                  onRoleChange={handleRoleChange}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                {/* Botón Delete solo visible si hay usuarios seleccionados */}
                {hasSelectedUsers && (
                  <Button
                    variant="secondary"
                    onClick={handleDelete}
                    disabled={processing}
                  >
                    {processing ? "Procesando..." : "Delete"}
                  </Button>
                )}
                <Button onClick={handleSave} disabled={processing}>
                  {processing ? "Guardando..." : "Save"}
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default RequestPageTemplate;