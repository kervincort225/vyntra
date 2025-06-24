"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulación de login simple con múltiples usuarios
    if ((email === "admin@vyntra.com" && password === "admin123") || 
        (email === "juan@empresa.com" && password === "client123")) {
      
      localStorage.setItem("vyntra-auth", "true");
      
      // Determinar rol basado en email
      const isAdmin = email === "admin@vyntra.com";
      const userData = {
        id: isAdmin ? '1' : '2',
        name: isAdmin ? 'Administrador Vyntra' : 'Juan Pérez',
        email: email,
        role: isAdmin ? 'admin' : 'client'
      };
      
      localStorage.setItem("vyntra-user", JSON.stringify(userData));
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Volver al inicio"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <div className="w-16"></div> {/* Spacer para centrar el título */}
        </div>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="border rounded px-3 py-2 outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded px-3 py-2 outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full py-2 font-semibold hover:scale-105 transition-transform">Acceder</button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors underline"
          >
            ¿No tienes cuenta? Volver al inicio
          </button>
        </div>
      </form>
    </div>
  );
} 