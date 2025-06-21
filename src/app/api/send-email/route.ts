import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

// Configuración de EmailJS usando variables de entorno del servidor
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_CONTACT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || '',
  TEMPLATE_ID_CHAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CHAT || '',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
};

// Inicializar EmailJS
if (EMAILJS_CONFIG.PUBLIC_KEY) {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// Verificar configuración
const isConfigured = () => {
  return EMAILJS_CONFIG.SERVICE_ID && 
         EMAILJS_CONFIG.TEMPLATE_ID_CONTACT && 
         EMAILJS_CONFIG.TEMPLATE_ID_CHAT && 
         EMAILJS_CONFIG.PUBLIC_KEY;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Verificar configuración
    if (!isConfigured()) {
      return NextResponse.json(
        { success: false, error: 'EmailJS no configurado en el servidor' },
        { status: 500 }
      );
    }

    if (type === 'contact') {
      // Enviar formulario de contacto
      const { name, email, service, message } = data;
      
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_CONTACT,
        {
          from_name: name,
          from_email: email,
          service_type: service,
          message: message,
          to_email: 'vyntrachile@gmail.com'
        }
      );

      return NextResponse.json({ success: true, result });

    } else if (type === 'chat') {
      // Enviar conversación del chat
      const { userEmail, messages } = data;
      
      // Formatear conversación
      const conversation = messages.map((msg: any) => 
        `${msg.isUser ? '👤 Usuario' : '🤖 Vyntra'} (${new Date(msg.timestamp).toLocaleTimeString()}): ${msg.text}`
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

      return NextResponse.json({ success: true, result });

    } else {
      return NextResponse.json(
        { success: false, error: 'Tipo de email no válido' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 