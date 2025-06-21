import { NextRequest, NextResponse } from 'next/server';

// Configuración de EmailJS usando variables de entorno del servidor
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_CONTACT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || '',
  TEMPLATE_ID_CHAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CHAT || '',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
};

// Verificar configuración
const isConfigured = () => {
  return EMAILJS_CONFIG.SERVICE_ID && 
         EMAILJS_CONFIG.TEMPLATE_ID_CONTACT && 
         EMAILJS_CONFIG.TEMPLATE_ID_CHAT && 
         EMAILJS_CONFIG.PUBLIC_KEY;
};

// Función para enviar email usando fetch (compatible con servidor)
const sendEmailViaEmailJS = async (serviceId: string, templateId: string, templateParams: any, publicKey: string) => {
  const url = 'https://api.emailjs.com/api/v1.0/email/send';
  
  const data = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams
  };

  console.log('📧 Enviando email con configuración:', {
    service_id: serviceId.substring(0, 10) + '...',
    template_id: templateId.substring(0, 10) + '...',
    user_id: publicKey.substring(0, 10) + '...',
    url: url
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  console.log('📧 Respuesta de EmailJS:', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error detallado de EmailJS:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
  }

  return await response.text();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Verificar configuración
    if (!isConfigured()) {
      console.error('EmailJS no configurado:', {
        SERVICE_ID: !!EMAILJS_CONFIG.SERVICE_ID,
        TEMPLATE_ID_CONTACT: !!EMAILJS_CONFIG.TEMPLATE_ID_CONTACT,
        TEMPLATE_ID_CHAT: !!EMAILJS_CONFIG.TEMPLATE_ID_CHAT,
        PUBLIC_KEY: !!EMAILJS_CONFIG.PUBLIC_KEY
      });
      return NextResponse.json(
        { success: false, error: 'EmailJS no configurado en el servidor' },
        { status: 500 }
      );
    }

    if (type === 'contact') {
      // Enviar formulario de contacto
      const { name, email, service, message } = data;
      
      const result = await sendEmailViaEmailJS(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_CONTACT,
        {
          from_name: name,
          from_email: email,
          service_type: service,
          message: message,
          to_email: 'vyntrachile@gmail.com'
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Email de contacto enviado exitosamente');
      return NextResponse.json({ success: true, result });

    } else if (type === 'chat') {
      // Enviar conversación del chat
      const { userEmail, messages } = data;
      
      // Formatear conversación
      const conversation = messages.map((msg: any) => 
        `${msg.isUser ? '👤 Usuario' : '🤖 Vyntra'} (${new Date(msg.timestamp).toLocaleTimeString()}): ${msg.text}`
      ).join('\n\n');

      const result = await sendEmailViaEmailJS(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_CHAT,
        {
          user_email: userEmail,
          conversation: conversation,
          to_email: 'vyntrachile@gmail.com',
          timestamp: new Date().toLocaleString()
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Conversación de chat enviada exitosamente');
      return NextResponse.json({ success: true, result });

    } else {
      return NextResponse.json(
        { success: false, error: 'Tipo de email no válido' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return NextResponse.json(
      { success: false, error: `Error interno del servidor: ${error}` },
      { status: 500 }
    );
  }
} 