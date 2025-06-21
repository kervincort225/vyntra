// Funciones para envío de emails a través del API endpoint
// Más seguro: las credenciales están en el servidor, no expuestas al cliente

// Función para enviar formulario de contacto
export const sendContactForm = async (formData: {
  name: string;
  email: string;
  service: string;
  message: string;
}) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contact',
        data: formData
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error enviando formulario de contacto:', error);
    return { success: false, error };
  }
};

// Función para enviar conversación del chat
export const sendChatConversation = async (
  userEmail: string,
  messages: Array<{ text: string; isUser: boolean; timestamp: Date }>
) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'chat',
        data: {
          userEmail,
          messages
        }
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error enviando conversación del chat:', error);
    return { success: false, error };
  }
};

// Función para verificar si el servicio está disponible
export const verifyEmailJSConfig = async () => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'test'
      })
    });
    
    // Si no es error 500, el servicio está configurado
    return response.status !== 500;
  } catch (error) {
    return false;
  }
}; 