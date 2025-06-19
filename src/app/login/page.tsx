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
    // Simulación de login simple
    if (email === "admin@vyntra.com" && password === "admin123") {
      localStorage.setItem("vyntra-auth", "true");
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">Iniciar sesión</h1>
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
      </form>
    </div>
  );
} 