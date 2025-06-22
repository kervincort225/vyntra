"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { sendContactForm, sendChatConversation } from "@/lib/emailjs";
import { LeadService } from '@/lib/services/LeadService';
import { LeadSource, LeadPriority } from '@/domain/entities/Lead';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "¡Hola! 👋 Soy el asistente virtual de Vyntra. ¿En qué puedo ayudarte hoy?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [chatEmail, setChatEmail] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulación de carga progresiva
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsPageLoaded(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll del chat y notificaciones
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Si el chat está cerrado y hay mensajes nuevos del bot, mostrar notificación
    if (!chatOpen && chatMessages.length > 1) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (!lastMessage.isUser) {
        setHasNewMessages(true);
      }
    }
  }, [chatMessages, chatOpen]);

  // Limpiar notificación cuando se abre el chat
  useEffect(() => {
    if (chatOpen) {
      setHasNewMessages(false);
    }
  }, [chatOpen]);

  // Scroll reveal animation mejorado
  useEffect(() => {
    if (!isPageLoaded) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [isPageLoaded]);

  // Chatbot inteligente
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: currentChatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentChatInput("");
    setIsTyping(true);

    // Simular respuesta inteligente del bot
    setTimeout(() => {
      const botResponse = generateBotResponse(currentChatInput);
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000);
  };

  // Respuestas inteligentes del chatbot
  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('precio') || lowerInput.includes('costo') || lowerInput.includes('cotizar')) {
      return "💰 Los precios varían según la complejidad del proyecto. Para darte una cotización exacta necesitaríamos conocer más detalles específicos. ¿Te gustaría que nuestro equipo comercial te contacte directamente?";
    }
    
    if (lowerInput.includes('licitacion') || lowerInput.includes('gobierno') || lowerInput.includes('publico')) {
      return "🏛️ Tenemos amplia experiencia en licitaciones públicas y ChileCompra. Hemos participado en más de 30 procesos exitosos. ¿Necesitas ayuda con alguna licitación específica?";
    }
    
    if (lowerInput.includes('automatizacion') || lowerInput.includes('proceso')) {
      return "⚡ La automatización puede reducir hasta un 80% el tiempo en procesos repetitivos. ¿Qué procesos te gustaría optimizar en tu empresa?";
    }
    
    if (lowerInput.includes('saas') || lowerInput.includes('software')) {
      return "💻 Desarrollamos SaaS escalables con tecnologías modernas como React, Node.js y AWS. ¿Tienes alguna idea específica en mente?";
    }
    
    if (lowerInput.includes('tiempo') || lowerInput.includes('cuando') || lowerInput.includes('plazo')) {
      return "⏱️ Los tiempos típicos son: Proyectos simples (2-4 semanas), Medianos (1-3 meses), Complejos (3-6 meses). ¿Qué tipo de proyecto tienes en mente?";
    }
    
    if (lowerInput.includes('contacto') || lowerInput.includes('llamar') || lowerInput.includes('reunir')) {
      return "📞 ¡Perfecto! La mejor forma es que te contactemos directamente. Puedes usar el formulario de contacto de la página o si prefieres algo más rápido, puedo enviarte esta conversación por email para que nuestro equipo te llame. ¿Qué prefieres?";
    }
    
    if (lowerInput.includes('experiencia') || lowerInput.includes('casos') || lowerInput.includes('ejemplos')) {
      return "🏆 Hemos desarrollado sistemas para retail, salud, educación y gobierno. Algunos casos exitosos: ERP para PYME (50% menos tiempo administrativo), App móvil con 10k+ usuarios, Sistema de licitaciones automatizado. ¿Te interesa algún sector específico?";
    }

    if (lowerInput.includes('hola') || lowerInput.includes('buenos') || lowerInput.includes('saludos')) {
      return "¡Hola! 😊 Me alegra conversar contigo. Estoy aquí para resolver todas tus dudas sobre nuestros servicios. ¿En qué área te gustaría que te ayude?";
    }

    if (lowerInput.includes('email') || lowerInput.includes('enviar') || lowerInput.includes('contactar')) {
      return "📧 ¡Claro! Puedo enviarte toda esta conversación por email para que nuestro equipo humano te contacte personalmente. Solo necesito tu dirección de correo. ¿Te parece bien?";
    }

    if (lowerInput.includes('si') || lowerInput.includes('sí') || lowerInput.includes('perfecto') || lowerInput.includes('bueno')) {
      return "¡Excelente! 🎉 Para continuar y que nuestro equipo te brinde atención personalizada, usa el botón 'Continuar por email' que aparece abajo. ¡Será muy rápido!";
    }

    if (lowerInput.includes('gracias') || lowerInput.includes('muchas gracias')) {
      return "¡De nada! 😊 Ha sido un placer ayudarte. Si quieres que nuestro equipo te contacte para profundizar en algún tema, no olvides usar el botón 'Continuar por email'. ¡Que tengas un excelente día!";
    }

    // Respuesta por defecto más inteligente
    return "🤔 Interesante pregunta. Te puedo ayudar con información sobre: Licitaciones 📄, Automatización ⚡, SaaS 💻, Precios 💰, Tiempos ⏱️ y Contacto 📞. ¿Sobre cuál te gustaría saber más?";
  };

  // Validación en tiempo real
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return undefined;
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return undefined;
      case 'service':
        if (!value) return 'Por favor selecciona un servicio';
        return undefined;
      case 'message':
        if (!value.trim()) return 'El mensaje es requerido';
        if (value.length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return undefined;
      default:
        return undefined;
    }
  };

  // Manejo de cambios en el formulario
  const handleFormChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  // Envío del formulario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const errors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) errors[key as keyof FormErrors] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Enviar con API endpoint seguro
      const result = await sendContactForm(formData);
      
      if (result.success) {
        console.log('✅ Email enviado exitosamente');
        
        // NUEVO: Guardar lead en la base de datos
        try {
          const leadService = LeadService.getInstance();
          await leadService.createLead({
            name: formData.name,
            email: formData.email,
            source: LeadSource.FORM,
            message: formData.message,
            // Asignar valor estimado según el servicio
            value: formData.service === 'licitaciones' ? 25000 : 
                   formData.service === 'automatizacion' ? 20000 :
                   formData.service === 'saas' ? 30000 : 15000,
            priority: formData.message.toLowerCase().includes('urgente') ? 
                     LeadPriority.HIGH : LeadPriority.MEDIUM
          });
          console.log('✅ Lead guardado en base de datos');
        } catch (dbError) {
          console.error('⚠️ No se pudo guardar en BD, pero el email se envió:', dbError);
          // No bloqueamos el flujo si falla la BD
        }
        
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", service: "", message: "" });
        setFormErrors({});
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        console.error('❌ Error enviando email:', result.error);
        // Mostrar error al usuario
        alert('Hubo un problema enviando el mensaje. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('❌ Error en envío:', error);
      alert('Hubo un problema enviando el mensaje. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para enviar conversación del chat por email
  const handleSendChatByEmail = async () => {
    if (!chatEmail.trim()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(chatEmail)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    setIsSendingChat(true);
    
    try {
      // Enviar con API endpoint seguro
      const result = await sendChatConversation(chatEmail, chatMessages);
      
      if (result.success) {
        console.log('✅ Conversación enviada exitosamente');
        
        // NUEVO: Guardar lead del chatbot en la base de datos
        try {
          const leadService = LeadService.getInstance();
          const conversationText = chatMessages
            .filter(msg => msg.isUser)
            .map(msg => msg.text)
            .join(' ');
          
          await leadService.createLead({
            name: 'Usuario del Chat',
            email: chatEmail,
            source: LeadSource.CHATBOT,
            message: conversationText || 'Conversación desde chatbot',
            priority: LeadPriority.HIGH, // Chatbot siempre es alta prioridad
            value: 20000 // Valor estimado por defecto para leads del chat
          });
          console.log('✅ Lead del chatbot guardado en base de datos');
        } catch (dbError) {
          console.error('⚠️ No se pudo guardar lead del chat en BD:', dbError);
        }
      } else {
        console.error('❌ Error enviando conversación:', result.error);
      }
    } catch (error) {
      console.error('❌ Error enviando conversación:', error);
    }
    
    setIsSendingChat(false);
    setShowEmailPrompt(false);
    setChatEmail("");
    
    // Mostrar mensaje de confirmación en el chat
    const confirmMessage: ChatMessage = {
      id: Date.now(),
      text: `✅ ¡Perfecto! He enviado nuestra conversación a ${chatEmail}. Nuestro equipo se pondrá en contacto contigo pronto. ¿Hay algo más en lo que pueda ayudarte?`,
      isUser: false,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, confirmMessage]);
  };

  // Función para mostrar el prompt de email
  const handleRequestEmail = () => {
    setShowEmailPrompt(true);
    
    // Agregar mensaje del bot explicando
    const emailRequestMessage: ChatMessage = {
      id: Date.now(),
      text: "📧 Para continuar esta conversación y que nuestro equipo te contacte personalmente, necesito tu email. ¡Será súper rápido!",
      isUser: false,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, emailRequestMessage]);
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
          <p className="mt-4 text-lg font-medium">Cargando experiencia increíble...</p>
          <p className="text-sm opacity-75">{Math.round(loadingProgress)}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden">
      {/* Fondo degradado animado mejorado */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-advanced bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100 opacity-70 blur-2xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-20 animate-float-slow blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200 rounded-full opacity-20 animate-float-reverse blur-3xl" />
      </div>

      {/* Header único con animación mejorada */}
      <header className="w-full flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-xl shadow-sm fixed top-0 left-0 z-40 header-slide-down border-b border-white/20">
        <div className="flex items-center group">
        <Image
            src="/Vyntra.png"
            alt="Vyntra"
            width={120}
            height={40}
            className="h-8 w-auto transition-transform group-hover:scale-105"
          />
        </div>
        
        {/* Navegación desktop mejorada */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { href: "/servicios", label: "Servicios" },
            { href: "#nosotros", label: "Nosotros" },
            { href: "#valores", label: "Valores" },
            { href: "#contacto", label: "Contacto" }
          ].map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group nav-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="/login"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 pulse-on-hover relative overflow-hidden group"
          >
            <span className="relative z-10">Iniciar sesión</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </nav>

        {/* Botón menú móvil mejorado */}
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

        {/* Menú móvil mejorado */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <div className="px-6 py-4 space-y-3">
            {[
              { href: "/servicios", label: "Servicios", icon: "🔧" },
              { href: "#nosotros", label: "Nosotros", icon: "👥" },
              { href: "#valores", label: "Valores", icon: "⭐" },
              { href: "#contacto", label: "Contacto", icon: "📞" }
            ].map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
            <a
              href="/login"
              className="flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <span>🔐</span>
              <span>Iniciar sesión</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section con animaciones escalonadas mejorado */}
      <section className="w-full flex flex-col items-center justify-center min-h-screen px-4 pt-20 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          <div className="animate-float mb-8 flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 scale-110 animate-pulse" />
            <Image
              src="/Vyntra.pngl.png"
              alt="Vyntra logo"
              width={380}
              height={380}
              priority
              className="drop-shadow-2xl mx-auto relative z-10 hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight hero-title text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Innovación, calidad, confianza.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 hero-subtitle text-center max-w-3xl mx-auto leading-relaxed">
            Impulsamos la transformación digital de tu negocio con soluciones tecnológicas a la medida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-buttons">
            <button
              onClick={() => setChatOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 pulse-on-hover shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>💬</span>
                <span>Hablar con experto</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <a
                              href="/servicios"
              className="px-8 py-3 border-2 border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 pulse-on-hover shadow-lg hover:shadow-xl transform hover:scale-105 relative group"
            >
              <span className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Ver Servicios</span>
              </span>
            </a>
          </div>
          
          {/* Indicadores de confianza mejorados */}
          <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-md mx-auto trust-indicators">
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-1 counter-animate">50+</div>
              <div className="text-sm text-gray-600">Proyectos</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-pink-600 mb-1 counter-animate">100%</div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-1 counter-animate">24h</div>
              <div className="text-sm text-gray-600">Respuesta</div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Servicios con animaciones escalonadas */}
      <section id="servicios" className="w-full max-w-6xl mx-auto px-4 py-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group service-card-1">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bounce-icon">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Licitaciones</h3>
            <p className="text-gray-700 text-sm">Desarrollamos y gestionamos proyectos para licitaciones públicas y privadas, asegurando cumplimiento y excelencia.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group service-card-2">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bounce-icon">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Automatización</h3>
            <p className="text-gray-700 text-sm">Creamos soluciones de automatización para optimizar procesos y aumentar la eficiencia de tu empresa.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-100 to-pink-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group service-card-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bounce-icon">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">SaaS</h3>
            <p className="text-gray-700 text-sm">Desarrollamos software como servicio, adaptado a las necesidades de tu negocio y listo para escalar.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group service-card-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bounce-icon">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Software</h3>
            <p className="text-gray-700 text-sm">Soluciones personalizadas para digitalizar y potenciar tu empresa, con tecnología de vanguardia.</p>
          </div>
        </div>
      </section>

      {/* Banner CTA horizontal independiente - Ancho controlado */}
      <section className="w-full py-16 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-2xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-[200px] lg:min-h-[240px]">
              {/* Contenido principal - Lado izquierdo */}
              <div className="flex-1 p-8 lg:p-12 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="lg:flex-1">
                    <div className="mb-3">
                      <span className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        <span>✨</span>
                        <span>Precios Transparentes</span>
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                      ¿Necesitas algo más específico?
                    </h3>
                    <p className="text-white/90 text-base lg:text-lg mb-6 lg:mb-0 leading-relaxed max-w-2xl">
                      Descubre nuestros <strong>4 paquetes completos</strong> con precios transparentes. 
                      <span className="text-yellow-300 font-semibold"> Incluye automatizaciones</span> súper de moda.
                    </p>
                  </div>
                  
                  {/* Botones y precio - Lado derecho */}
                  <div className="lg:ml-8 flex flex-col lg:flex-row items-center gap-6">
                    <div className="text-center lg:text-right">
                      <div className="text-white/80 text-sm">Proyectos desde</div>
                      <div className="text-3xl lg:text-4xl font-bold text-yellow-300">$800K</div>
                      <div className="text-white/80 text-sm">CLP</div>
                    </div>
                    <a
                      href="/servicios"
                      className="inline-flex items-center space-x-3 bg-white text-purple-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group whitespace-nowrap"
                    >
                      <span>🚀</span>
                      <span>Ver Todos los Servicios</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Mini preview de servicios - Fila horizontal */}
                <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                    <span>🌐</span>
                    <span className="text-white/90">Web $800K+</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                    <span>🚀</span>
                    <span className="text-white/90">Sistema $1.8M+</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                    <span>⚡</span>
                    <span className="text-white/90">Custom $3M+</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                    <span>🤖</span>
                    <span className="text-white/90">Automatización</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros con scroll reveal */}
      <section id="nosotros" className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12 scroll-reveal">
        <div className="flex-shrink-0">
          <Image
            src="/Vyntra.png"
            alt="Logo completo Vyntra"
            width={200}
            height={200}
            className="rounded-xl shadow-lg border-4 border-white bg-white"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Sobre nosotros</h2>
          <p className="text-gray-700 mb-4 text-lg">
            Somos un equipo apasionado por la tecnología y la innovación. Vyntra nace del deseo de transformar negocios y crear soluciones digitales que generen impacto real.
          </p>
          <p className="text-gray-700 mb-6">
            Nuestra misión es acompañar a empresas y emprendedores en su camino hacia la digitalización, aportando calidad, creatividad y confianza en cada proyecto.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">Proyectos Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Clientes Satisfechos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores con scroll reveal */}
      <section id="valores" className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 items-center justify-center scroll-reveal">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Innovación</h3>
          <p className="text-gray-600 text-center">Siempre a la vanguardia tecnológica para ofrecerte lo mejor.</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Calidad</h3>
          <p className="text-gray-600 text-center">Procesos y productos de excelencia, enfocados en resultados.</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Confianza</h3>
          <p className="text-gray-600 text-center">Transparencia y compromiso en cada proyecto.</p>
        </div>
      </section>

      {/* Sección de Contacto con scroll reveal */}
      <section id="contacto" className="w-full max-w-4xl mx-auto px-4 py-16 scroll-reveal">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tu negocio?</h2>
          <p className="text-gray-600 text-lg">Contáctanos y descubre cómo podemos ayudarte a alcanzar tus objetivos digitales.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">vyntrachile@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Ubicación</h3>
                <p className="text-gray-600">Chile, Jorge Cáceres 503</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-purple-100 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <span>📝</span>
              <span>Envíanos un mensaje</span>
            </h3>
            
            {/* Mensaje de éxito */}
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg animate-fadein">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-green-800 font-medium">¡Mensaje enviado exitosamente!</span>
                </div>
                <p className="text-green-700 text-sm mt-1">Nos pondremos en contacto contigo en menos de 24 horas.</p>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Tu nombre completo *"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.name 
                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                      : formData.name 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Tu email *"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.email 
                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                      : formData.email && !formErrors.email
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>
              
              <div>
                <select
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white ${
                    formErrors.service 
                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                      : formData.service 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-purple-300'
                  }`}
                  value={formData.service}
                  onChange={(e) => handleFormChange('service', e.target.value)}
                >
                  <option value="">¿En qué podemos ayudarte? *</option>
                  <option value="cotizacion">💰 Quiero cotizar un proyecto</option>
                  <option value="licitacion">🏛️ Consulta sobre licitaciones</option>
                  <option value="automatizacion">⚡ Automatización de procesos</option>
                  <option value="saas">☁️ Desarrollo de SaaS</option>
                  <option value="software">💻 Software personalizado</option>
                  <option value="consultoria">💡 Consultoría tecnológica</option>
                  <option value="contacto">📞 Solo quiero contactarlos</option>
                  <option value="otro">🔧 Otro</option>
                </select>
                {formErrors.service && (
                  <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{formErrors.service}</span>
                  </p>
                )}
              </div>
              
              <div>
                <textarea
                  placeholder="Cuéntanos más sobre tu proyecto o consulta... *"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                    formErrors.message 
                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                      : formData.message && !formErrors.message
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.message ? (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{formErrors.message}</span>
                    </p>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {formData.message.length}/500 caracteres
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preguntas frecuentes - Menú desplegable */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFaqOpen(!faqOpen)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-purple-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-lg">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">Preguntas frecuentes</h4>
                      <p className="text-sm text-purple-600">Haz clic para ver las dudas más comunes</p>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-200 ${faqOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {faqOpen && (
                  <div className="px-4 pb-4 space-y-3 animate-fadein">
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-500 font-bold">Q:</span>
                        <div>
                          <p className="font-medium text-gray-800">¿Cuánto tiempo toma desarrollar mi proyecto?</p>
                          <p className="text-sm text-gray-600 mt-1">Depende de la complejidad, pero típicamente entre 4-12 semanas.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-500 font-bold">Q:</span>
                        <div>
                          <p className="font-medium text-gray-800">¿Ofrecen soporte post-lanzamiento?</p>
                          <p className="text-sm text-gray-600 mt-1">Sí, incluimos 3 meses de soporte gratuito y planes extendidos.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-500 font-bold">Q:</span>
                        <div>
                          <p className="font-medium text-gray-800">¿Pueden integrar con sistemas existentes?</p>
                          <p className="text-sm text-gray-600 mt-1">Absolutamente, especializamos en integraciones complejas.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-500 font-bold">Q:</span>
                        <div>
                          <p className="font-medium text-gray-800">¿Trabajan con metodologías ágiles?</p>
                          <p className="text-sm text-gray-600 mt-1">Sí, usamos Scrum con entregas cada 2 semanas.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-500 font-bold">Q:</span>
                        <div>
                          <p className="font-medium text-gray-800">¿Ayudan con licitaciones públicas?</p>
                          <p className="text-sm text-gray-600 mt-1">Sí, tenemos experiencia en ChileCompra y procesos gubernamentales.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 pulse-on-hover shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-400 border-t mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
          <Image
                src="/Vyntra.png"
                alt="Vyntra"
                width={100}
                height={40}
                className="h-8 w-auto mx-auto md:mx-0"
              />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} Vyntra. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Chatbot Widget Mejorado */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 pulse-on-hover ${
            chatOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-110'
          }`}
          onClick={() => setChatOpen(!chatOpen)}
          aria-label={chatOpen ? "Cerrar chat" : "Abrir chat"}
        >
          {chatOpen ? (
            <span className="text-white text-2xl font-bold">×</span>
          ) : (
            <div className="relative">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.36L2 22l5.64-1.05C9.96 21.64 11.46 22 13 22h-.5c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
                <circle cx="8.5" cy="12" r="1.5" fill="#fff"/>
                <circle cx="12" cy="12" r="1.5" fill="#fff"/>
                <circle cx="15.5" cy="12" r="1.5" fill="#fff"/>
              </svg>
              {/* Indicador de notificación */}
              {hasNewMessages && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
            </div>
          )}
        </button>
        
        {chatOpen && (
          <div className="absolute bottom-20 right-0 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fadein flex flex-col overflow-hidden">
            {/* Header del chat */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">Asistente Vyntra</h3>
                  <p className="text-sm opacity-90">En línea • Respuesta inmediata</p>
                </div>
              </div>
            </div>
            
            {/* Mensajes del chat */}
            <div className="flex-1 p-4 max-h-80 overflow-y-auto space-y-3 bg-gray-50">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white text-gray-800 shadow-sm border'
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs">🤖</span>
                        <span className="text-xs font-medium text-purple-600">Vyntra Bot</span>
                      </div>
                    )}
                    <p className="leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-2xl text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">🤖</span>
                      <span className="text-xs font-medium text-purple-600">Vyntra Bot</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Input del chat */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentChatInput}
                  onChange={(e) => setCurrentChatInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!currentChatInput.trim() || isTyping}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentChatInput.trim() && !isTyping
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 pulse-on-hover'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
                             {/* Prompt de email */}
               {showEmailPrompt && (
                 <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                   <div className="flex items-center space-x-2 mb-2">
                     <span className="text-purple-600">📧</span>
                     <span className="text-sm font-medium text-purple-800">Continuar por email</span>
                   </div>
                   <div className="flex space-x-2">
                     <input
                       type="email"
                       value={chatEmail}
                       onChange={(e) => setChatEmail(e.target.value)}
                       placeholder="tu@email.com"
                       className="flex-1 px-3 py-2 text-sm border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                       onKeyPress={(e) => e.key === 'Enter' && handleSendChatByEmail()}
                     />
                     <button
                       onClick={handleSendChatByEmail}
                       disabled={isSendingChat || !chatEmail.trim()}
                       className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                         isSendingChat || !chatEmail.trim()
                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                       }`}
                     >
                       {isSendingChat ? (
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       ) : (
                         'Enviar'
                       )}
                     </button>
                   </div>
                   <button
                     onClick={() => setShowEmailPrompt(false)}
                     className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                   >
                     Cancelar
                   </button>
                 </div>
               )}

               {/* Sugerencias rápidas */}
               <div className="flex flex-wrap gap-2 mt-3">
                 {[
                   "💰 Precios",
                   "⏱️ Tiempos", 
                   "🏛️ Licitaciones",
                   "📞 Contacto"
                 ].map((suggestion) => (
                   <button
                     key={suggestion}
                     type="button"
                     onClick={() => setCurrentChatInput(suggestion.split(' ')[1])}
                     className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                   >
                     {suggestion}
                   </button>
                 ))}
                 
                 {/* Botón para continuar por email */}
                 {chatMessages.length > 2 && !showEmailPrompt && (
                   <button
                     onClick={handleRequestEmail}
                     className="px-3 py-1 text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full hover:from-green-200 hover:to-blue-200 transition-all border border-green-300 font-medium"
                   >
                     📧 Continuar por email
                   </button>
                 )}
               </div>
            </form>
          </div>
        )}
      </div>
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
