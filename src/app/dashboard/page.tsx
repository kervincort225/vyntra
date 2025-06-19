"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const proyectos = [
  { nombre: "Automatización de Inventario", estado: "En progreso" },
  { nombre: "Portal de Licitaciones", estado: "Finalizado" },
  { nombre: "SaaS para PYMES", estado: "En desarrollo" },
];
const contactos = [
  { nombre: "Juan Pérez", email: "juan@empresa.com" },
  { nombre: "Ana López", email: "ana@negocio.com" },
];

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("vyntra-auth") !== "true") {
      router.push("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("vyntra-auth");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-2xl font-bold mb-2">Bienvenido al Dashboard de Vyntra</h1>
        <button onClick={handleLogout} className="text-sm text-pink-600 underline float-right">Cerrar sesión</button>
        <h2 className="text-xl font-semibold mt-6 mb-2">Proyectos</h2>
        <ul className="mb-6">
          {proyectos.map((p, i) => (
            <li key={i} className="mb-1">• <b>{p.nombre}</b> <span className="text-xs text-gray-500">({p.estado})</span></li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mb-2">Contactos</h2>
        <ul>
          {contactos.map((c, i) => (
            <li key={i} className="mb-1">• {c.nombre} <span className="text-xs text-gray-500">({c.email})</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
} 