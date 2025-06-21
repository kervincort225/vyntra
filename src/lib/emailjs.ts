// Funciones para envío de emails a través del API endpoint
// Más seguro: las credenciales están en el servidor, no expuestas al cliente

import emailjs from '@emailjs/browser';

// Función para obtener configuración de EmailJS
const getEmailJSConfig = () => {
  // Intentar leer desde JSON (producción)
  if (process.env.EMAILJS_CONFIG) {
    try {
      return JSON.parse(process.env.EMAILJS_CONFIG);
    } catch (error) {
      console.error('Error parsing EMAILJS_CONFIG JSON:', error);
      return {};
    }
  }
  
  // Fallback a variables separadas (desarrollo)
  return {
    service_id: process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    template_contact: process.env.EMAILJS_TEMPLATE_CONTACT || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || '',
    template_chat: process.env.EMAILJS_TEMPLATE_CHAT || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CHAT || '',
    public_key: process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
  };
};

// Obtener configuración
const emailjsConfig = getEmailJSConfig();

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: emailjsConfig.service_id,
  TEMPLATE_ID_CONTACT: emailjsConfig.template_contact,
  TEMPLATE_ID_CHAT: emailjsConfig.template_chat,
  PUBLIC_KEY: emailjsConfig.public_key
};

// Inicializar EmailJS solo si está configurado
if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== '') {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// Función para verificar configuración
const verifyEmailJSConfig = () => {
  const isConfigured = 
    EMAILJS_CONFIG.SERVICE_ID !== '' &&
    EMAILJS_CONFIG.TEMPLATE_ID_CONTACT !== '' &&
    EMAILJS_CONFIG.TEMPLATE_ID_CHAT !== '' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== '';
  
  return isConfigured;
};

// Función para enviar formulario de contacto
export const sendContactForm = async (formData: {
  name: string;
  email: string;
  service: string;
  message: string;
}) => {
  // Verificar si EmailJS está configurado
  if (!verifyEmailJSConfig()) {
    console.log('📧 EmailJS no configurado - usando modo simulación');
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: false, error: 'EmailJS no configurado' };
  }

  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_CONTACT,
      {
        from_name: formData.name,
        from_email: formData.email,
        service_type: formData.service,
        message: formData.message,
        to_email: 'vyntrachile@gmail.com'
      }
    );
    return { success: true, result };
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    return { success: false, error };
  }
};

// Función para enviar conversación del chat
export const sendChatConversation = async (
  userEmail: string,
  messages: Array<{ text: string; isUser: boolean; timestamp: Date }>
) => {
  // Verificar si EmailJS está configurado
  if (!verifyEmailJSConfig()) {
    console.log('💬 EmailJS no configurado - usando modo simulación para chat');
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: false, error: 'EmailJS no configurado' };
  }

  try {
    // Formatear conversación
    const conversation = messages.map(msg => 
      `${msg.isUser ? '👤 Usuario' : '🤖 Vyntra'} (${msg.timestamp.toLocaleTimeString()}): ${msg.text}`
    ).join('\n\n');

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_CHAT,
      {
        user_email: userEmail,
        conversation: conversation,
        to_email: 'vyntrachile@gmail.com',
        timestamp: new Date().toLocaleString()
      }
    );
    return { success: true, result };
  } catch (error) {
    console.error('Error enviando conversación del chat:', error);
    return { success: false, error };
  }
};

// Función para verificar configuración (exportada)
export { verifyEmailJSConfig }; 