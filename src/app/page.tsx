"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white text-gray-900 font-sans relative overflow-x-hidden">
      {/* Fondo degradado animado */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100 opacity-70 blur-2xl" />

      {/* Hero Section */}
      <header className="w-full flex flex-col items-center justify-center pt-8 pb-4 px-4 fade-in">
        <div className="animate-float mb-2">
          <Image
            src="/Vyntra.pngl.png"
            alt="Vyntra logo"
            width={380}
            height={380}
            priority
            className="drop-shadow-xl"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-1 tracking-tight animate-fadein">
          Innovación, calidad, confianza.
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mb-4 animate-fadein">
          Impulsamos la transformación digital de tu negocio con soluciones tecnológicas a la medida.
        </p>
        <a
          href="mailto:hola@vyntra.com"
          className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-200 fade-in"
        >
          Contáctanos
        </a>
      </header>

      {/* Servicios / Casos de Uso */}
      <section className="w-full max-w-4xl px-4 py-8 grid gap-8 md:grid-cols-2 fade-in">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6 shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Proyectos de Licitaciones</h2>
          <p className="text-gray-700 text-center">Desarrollamos y gestionamos proyectos para licitaciones públicas y privadas, asegurando cumplimiento y excelencia.</p>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-6 shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Automatización</h2>
          <p className="text-gray-700 text-center">Creamos soluciones de automatización para optimizar procesos y aumentar la eficiencia de tu empresa.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-pink-100 rounded-xl p-6 shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">SaaS</h2>
          <p className="text-gray-700 text-center">Desarrollamos software como servicio, adaptado a las necesidades de tu negocio y listo para escalar.</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Software para Negocios</h2>
          <p className="text-gray-700 text-center">Soluciones personalizadas para digitalizar y potenciar tu empresa, con tecnología de vanguardia.</p>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section className="w-full max-w-3xl px-4 py-12 flex flex-col md:flex-row items-center gap-8 fade-in">
        <div className="flex-shrink-0">
          <Image
            src="/Vyntra.png"
            alt="Logo completo Vyntra"
            width={180}
            height={180}
            className="rounded-xl shadow-lg border-4 border-white bg-white"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Sobre nosotros</h2>
          <p className="text-gray-700 mb-2">
            Somos un equipo apasionado por la tecnología y la innovación. Vyntra nace del deseo de transformar negocios y crear soluciones digitales que generen impacto real.
          </p>
          <p className="text-gray-700">
            Nuestra misión es acompañar a empresas y emprendedores en su camino hacia la digitalización, aportando calidad, creatividad y confianza en cada proyecto.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="w-full max-w-4xl px-4 py-8 flex flex-col md:flex-row gap-8 items-center justify-center fade-in">
        <div className="flex-1 flex flex-col items-center">
          {/* Bombilla para Innovación */}
          <span className="mb-2">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#f3e8ff"/><path d="M12 17v1m-2 1h4m-2-2a5 5 0 1 0-2-9.584" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 13h6" stroke="#a21caf" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <h3 className="text-lg font-semibold mb-1">Innovación</h3>
          <p className="text-gray-600 text-center text-sm">Siempre a la vanguardia tecnológica para ofrecerte lo mejor.</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          {/* Medalla para Calidad */}
          <span className="mb-2">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#f3e8ff"/><path d="M12 15.5l3.09 1.636-.59-3.44 2.5-2.44-3.46-.5L12 7.5l-1.54 3.256-3.46.5 2.5 2.44-.59 3.44L12 15.5z" stroke="#a21caf" strokeWidth="2" strokeLinejoin="round"/></svg>
          </span>
          <h3 className="text-lg font-semibold mb-1">Calidad</h3>
          <p className="text-gray-600 text-center text-sm">Procesos y productos de excelencia, enfocados en resultados.</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          {/* Apretón de manos para Confianza */}
          <span className="mb-2">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#f3e8ff"/><path d="M7.5 13.5l2 2a2 2 0 0 0 2.83 0l2-2M8 12l-2-2m10 2l2-2m-6 2V8m0 4l-2-2m2 2l2-2" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <h3 className="text-lg font-semibold mb-1">Confianza</h3>
          <p className="text-gray-600 text-center text-sm">Transparencia y compromiso en cada proyecto.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-8 fade-in">
        © {new Date().getFullYear()} Vyntra. Todos los derechos reservados.
      </footer>

      {/* Chatbot Widget */}
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        onClick={() => setChatOpen((v) => !v)}
        aria-label="Abrir chat"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M7 10h10M7 14h6" stroke="#a21caf" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 animate-fadein flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-xl">
            <span className="font-semibold text-purple-700">Vyntra Chat</span>
            <button onClick={() => setChatOpen(false)} aria-label="Cerrar chat" className="text-gray-500 hover:text-gray-800">×</button>
          </div>
          <div className="flex-1 p-4 text-sm text-gray-700" style={{ minHeight: 120 }}>
            <div className="mb-2"><b>Bot:</b> ¡Hola! ¿En qué podemos ayudarte hoy?</div>
            <div className="mb-2 text-right"><b>Tú:</b> Quiero saber más sobre sus servicios.</div>
            <div><b>Bot:</b> Ofrecemos soluciones de licitaciones, automatización, SaaS y software para negocios. ¿Te gustaría agendar una llamada?</div>
          </div>
          <form className="flex border-t">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 rounded-bl-xl outline-none"
              disabled
            />
            <button type="submit" className="px-4 text-purple-500 font-bold cursor-not-allowed" disabled>→</button>
          </form>
        </div>
      )}
    </div>
  );
}

// Animaciones personalizadas para el hero
// Agrega esto en globals.css:
// .animate-gradient { animation: gradientBG 8s ease-in-out infinite alternate; }
// @keyframes gradientBG { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(30deg); } }
// .animate-float { animation: float 3s ease-in-out infinite alternate; }
// @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-16px); } }
// .animate-fadein { animation: fadeInUp 1.2s cubic-bezier(.39,.575,.565,1) both; }
