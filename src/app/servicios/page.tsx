"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { sendContactForm } from "@/lib/emailjs";
import { LeadService } from '@/lib/services/LeadService';
import { LeadSource, LeadPriority } from '@/domain/entities/Lead';

interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

export default function ServiciosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simulación de carga
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsPageLoaded(true);
          return 100;
        }
        return prev + Math.random() * 20 + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    if (!isPageLoaded) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [isPageLoaded]);

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(packageName);
    setFormData(prev => ({ ...prev, service: packageName }));
    setShowContactForm(true);
    
    // Scroll al formulario
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await sendContactForm({
        ...formData,
        message: `Interesado en: ${formData.service}\n\n${formData.message}`
      });
      
      if (result.success) {
        // Guardar lead en la base de datos
        try {
          const leadService = LeadService.getInstance();
          await leadService.createLead({
            name: formData.name,
            email: formData.email,
            source: LeadSource.FORM,
            message: `Paquete: ${formData.service} - ${formData.message}`,
            value: formData.service.includes('Básico') ? 15000 : 
                   formData.service.includes('Intermedio') ? 25000 :
                   formData.service.includes('Avanzado') ? 40000 : 20000,
            priority: LeadPriority.HIGH
          });
        } catch (dbError) {
          console.error('Error guardando lead:', dbError);
        }
        
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", service: "", message: "" });
        setShowContactForm(false);
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      alert('Hubo un problema. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading screen
  if (!isPageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="mb-8">
            <Image
              src="/Vyntra.pngl.png"
              alt="Vyntra"
              width={200}
              height={200}
              className="mx-auto animate-pulse"
            />
          </div>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="mt-4 text-lg font-medium">Cargando nuestros servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden">
      {/* Fondo degradado animado */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-advanced bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100 opacity-70 blur-2xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-20 animate-float-slow blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200 rounded-full opacity-20 animate-float-reverse blur-3xl" />
      </div>

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-xl shadow-sm fixed top-0 left-0 z-40 border-b border-white/20">
        <div className="flex items-center group">
          <a href="/">
            <Image
              src="/Vyntra.png"
              alt="Vyntra"
              width={120}
              height={40}
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
          </a>
        </div>
        
        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { href: "/#servicios", label: "Servicios" },
            { href: "/#nosotros", label: "Nosotros" },
            { href: "/#valores", label: "Valores" },
            { href: "/#contacto", label: "Contacto" }
          ].map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="/login"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Iniciar sesión
          </a>
        </nav>

        {/* Botón menú móvil */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={`w-6 h-6 relative transition-all duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
            <span className={`absolute top-0 left-0 w-full h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 top-2.5' : ''}`} />
            <span className={`absolute top-2.5 left-0 w-full h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute top-5 left-0 w-full h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 top-2.5' : ''}`} />
          </div>
        </button>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-screen px-4 pt-20 relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="scroll-reveal opacity-0 transform translate-y-10 transition-all duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Nuestros Servicios
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Soluciones tecnológicas escalables diseñadas por ingenieros de sistemas para impulsar tu negocio
            </p>
          </div>

          {/* Paquetes de Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            
            {/* Paquete Básico */}
            <div className="scroll-reveal opacity-0 transform translate-y-10 transition-all duration-1000 delay-200">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Web Profesional</h3>
                  <div className="text-3xl font-bold text-green-600 mb-6">
                    $800k - $1.2M
                    <span className="text-sm font-normal text-gray-500 block">CLP</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Landing profesional</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Formularios inteligentes</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> CMS básico</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Responsive móvil</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SEO optimizado</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 3 meses soporte</li>
                  </ul>
                  <div className="text-sm text-gray-500 mb-6">⏱️ Entrega: 2-3 semanas</div>
                  <button
                    onClick={() => handlePackageSelect('Paquete Básico - Web Profesional')}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Solicitar Cotización
                  </button>
                </div>
              </div>
            </div>

            {/* Paquete Intermedio */}
            <div className="scroll-reveal opacity-0 transform translate-y-10 transition-all duration-1000 delay-400">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Sistema Web</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-6">
                    $1.8M - $2.5M
                    <span className="text-sm font-normal text-gray-500 block">CLP</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Todo lo anterior +</li>
                    <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Dashboard admin</li>
                    <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Base de datos</li>
                    <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> APIs personalizadas</li>
                    <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Sistema de gestión</li>
                    <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> 6 meses soporte</li>
                  </ul>
                  <div className="text-sm text-gray-500 mb-6">⏱️ Entrega: 4-6 semanas</div>
                  <button
                    onClick={() => handlePackageSelect('Paquete Intermedio - Sistema Web')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Solicitar Cotización
                  </button>
                </div>
              </div>
            </div>

            {/* Paquete Avanzado */}
            <div className="scroll-reveal opacity-0 transform translate-y-10 transition-all duration-1000 delay-600">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Arquitectura Custom</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-6">
                    $3M - $5M
                    <span className="text-sm font-normal text-gray-500 block">CLP</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Todo lo anterior +</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Microservicios</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Integraciones avanzadas</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Alta escalabilidad</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Capacitación equipo</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> 12 meses soporte</li>
                  </ul>
                  <div className="text-sm text-gray-500 mb-6">⏱️ Entrega: 6-10 semanas</div>
                  <button
                    onClick={() => handlePackageSelect('Paquete Avanzado - Arquitectura Custom')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Solicitar Cotización
                  </button>
                </div>
              </div>
            </div>

            {/* Automatizaciones */}
            <div className="scroll-reveal opacity-0 transform translate-y-10 transition-all duration-1000 delay-800">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Automatizaciones</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-6">
                    $500k - $1.5M
                    <span className="text-sm font-normal text-gray-500 block">CLP</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> WhatsApp + CRM</li>
                    <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Emails automáticos</li>
                    <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Workflows inteligentes</li>
                    <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Integraciones API</li>
                    <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> ROI en 3 meses</li>
                    <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Soporte incluido</li>
                  </ul>
                  <div className="text-sm text-gray-500 mb-6">⏱️ Entrega: 2-4 semanas</div>
                  <button
                    onClick={() => handlePackageSelect('Automatizaciones - WhatsApp + CRM')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Solicitar Cotización
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Servicios Adicionales */}
          <div className="scroll-reveal opacity-0 transform translate-y-10 transition-all duration-1000 delay-1000 mt-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Servicios Adicionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="text-xl font-bold mb-3">Consultoría Especializada</h3>
                <p className="text-gray-600 mb-4">Automatización de procesos, integración de sistemas, auditoría técnica</p>
                <div className="text-2xl font-bold text-gray-800">$35k - $45k CLP/hora</div>
                <div className="text-sm text-gray-500">Mínimo 4 horas por proyecto</div>
              </div>

              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-xl font-bold mb-3">Mantenimiento Mensual</h3>
                <p className="text-gray-600 mb-4">Soporte técnico, actualizaciones y mejoras continuas</p>
                <div className="text-2xl font-bold text-gray-800">$200k - $400k CLP/mes</div>
                <div className="text-sm text-gray-500">5-10 horas incluidas</div>
              </div>

              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="text-xl font-bold mb-3">Licitaciones Públicas</h3>
                <p className="text-gray-600 mb-4">Proyectos especializados para organismos del Estado</p>
                <div className="text-2xl font-bold text-gray-800">Cotización Personalizada</div>
                <div className="text-sm text-gray-500">Experiencia en ChileCompra</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Formulario de Contacto */}
      {showContactForm && (
        <section id="contact-form" className="w-full py-20 px-4 relative">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Solicitar Información
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Interesado en: <strong>{selectedPackage}</strong>
              </p>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cuéntanos sobre tu proyecto</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Describe tu proyecto, necesidades específicas, timeline esperado..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Mensaje de éxito */}
      {submitSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          ¡Solicitud enviada! Te contactaremos pronto.
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/Vyntra.png"
              alt="Vyntra"
              width={120}
              height={40}
              className="h-8 w-auto mx-auto mb-4 opacity-80"
            />
            <p className="text-gray-400">Innovación, calidad, confianza.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Desarrollo Web</li>
                <li>Sistemas Custom</li>
                <li>Automatizaciones</li>
                <li>Licitaciones</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                <li><a href="/#valores" className="hover:text-white transition-colors">Valores</a></li>
                <li><a href="/#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 vyntrachile@gmail.com</p>
                <p>📍 Chile, Jorge Cáceres 503</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              © 2024 Vyntra. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Estilos adicionales */}
      <style jsx>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease-out;
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float 8s ease-in-out infinite reverse;
        }
        .animate-gradient-advanced {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
} 