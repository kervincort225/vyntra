// Funciones para envío de emails a través del API endpoint
// Más seguro: las credenciales están en el servidor, no expuestas al cliente

import emailjs from '@emailjs/browser';

// EmailJS - Configuración temporal hardcodeada
// TODO: Mover a variables de entorno seguras después

// Configuración temporal hardcodeada
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_w3gz69i',
  TEMPLATE_ID_CONTACT: 'template_87ecy4q', 
  TEMPLATE_ID_CHAT: 'template_j69lvrm', // Usar el mismo template por ahora
  PUBLIC_KEY: 'yTG32yzqK0CjL3qXC' // Reemplazar con tu public key real
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Función para enviar formulario de contacto
export const sendContactForm = async (formData: {
  name: string;
  email: string;
  service: string;
  message: string;
}) => {
  console.log('📧 Enviando formulario de contacto...');
  
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
    console.log('✅ Email de contacto enviado exitosamente:', result);
    return { success: true, result, real: true };
  } catch (error) {
    console.error('❌ Error enviando email de contacto:', error);
    return { success: false, error };
  }
};

// Función para enviar conversación del chat
export const sendChatConversation = async (
  userEmail: string,
  messages: Array<{ text: string; isUser: boolean; timestamp: Date }>
) => {
  console.log('💬 Enviando conversación del chat...');
  
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
    console.log('✅ Conversación enviada exitosamente:', result);
    return { success: true, result, real: true };
  } catch (error) {
    console.error('❌ Error enviando conversación del chat:', error);
    return { success: false, error };
  }
};

// Función para verificar configuración (exportada)
export { verifyEmailJSConfig }; 