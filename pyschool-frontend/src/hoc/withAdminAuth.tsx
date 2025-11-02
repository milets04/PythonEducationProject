// components/hoc/withAdminAuth.tsx
// Higher Order Component para proteger rutas de administrador

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/*interface UserData {
 id: number;
 firstName: string;
 lastName: string;
 email: string;
 role: string;
}*/

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const redirectByRole = (role: string) => {
        switch (role) {
          case "student":
            router.push("/waitPage");
            break;
          case "editorTeacher":
            router.push("/teacherPages/addContent");
            break;
          case "executorTeacher":
            router.push("/teacherPages/addContent");
            break;
          default:
            router.push("/");
        }
      };

      const checkAuth = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            router.push("/login");
            return;
          }

          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("No autorizado");
          }

          const data = await response.json();

          if (data.success && data.data.role === "administrator") {
            setIsAuthorized(true);
          } else {
            redirectByRole(data.data.role); 
          }
        } catch (error) {
          console.error("Error de autenticación:", error);
          router.push("/login");
        } finally {
          setLoading(false);
        }
      };

      checkAuth();

    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verificando acceso...</p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600">
              No tienes permisos para acceder a esta página
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
