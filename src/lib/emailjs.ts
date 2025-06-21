import emailjs from '@emailjs/browser';

// Configuración de EmailJS usando variables de entorno
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_CONTACT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || '',
  TEMPLATE_ID_CHAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CHAT || '',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
};

// Inicializar EmailJS solo si está configurado
if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== '') {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

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

// Función para verificar configuración
export const verifyEmailJSConfig = () => {
  const isConfigured = 
    EMAILJS_CONFIG.SERVICE_ID !== '' &&
    EMAILJS_CONFIG.TEMPLATE_ID_CONTACT !== '' &&
    EMAILJS_CONFIG.TEMPLATE_ID_CHAT !== '' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== '';
  
  return isConfigured;
}; 