// components/hoc/withStudentAuth.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withStudentAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function StudentProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
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

        if (data.success && data.data.role === "student") {
          setIsAuthorized(true);
        } else {
          redirectByRole(data.data.role);
        }
      } catch (error) {
        console.error("Error de autenticación:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    const redirectByRole = (role: string) => {
      switch (role) {
        case "administrator":
          router.push("/requests");
          break;
        case "editorTeacher":
        case "executorTeacher":
          router.push("/teacherPages/addContent");
          break;
        default:
          router.push("/");
      }
    };

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
      return null;
    }

    return <Component {...props} />;
  };
}