"use client";
import { useState, useEffect } from "react";

interface Message {
  id: string;
  sender: 'client' | 'team' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'file' | 'system';
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'team',
    senderName: 'María García - Project Manager',
    message: '¡Hola Juan! Te escribo para informarte que hemos completado la primera fase del proyecto. El módulo de autenticación ya está funcionando perfectamente.',
    timestamp: '2024-01-25 10:30',
    read: true,
    type: 'text'
  },
  {
    id: '2',
    sender: 'client',
    senderName: 'Juan Pérez',
    message: 'Excelente noticia! ¿Cuándo podríamos programar una demo para revisar el progreso?',
    timestamp: '2024-01-25 11:15',
    read: true,
    type: 'text'
  },
  {
    id: '3',
    sender: 'team',
    senderName: 'Carlos Ruiz - Developer',
    message: 'Podemos hacer la demo este viernes a las 15:00. Te comparto el documento con las funcionalidades implementadas.',
    timestamp: '2024-01-25 11:45',
    read: true,
    type: 'file',
    attachments: [
      {
        name: 'Funcionalidades_Fase1.pdf',
        url: '#',
        type: 'pdf'
      }
    ]
  },
  {
    id: '4',
    sender: 'system',
    senderName: 'Sistema',
    message: 'Se ha actualizado el estado del proyecto "Sistema ERP PYME" a 45% completado.',
    timestamp: '2024-01-25 14:20',
    read: false,
    type: 'system'
  },
  {
    id: '5',
    sender: 'team',
    senderName: 'Ana López - QA Tester',
    message: 'Hemos terminado las pruebas del módulo de inventario. Todo funciona correctamente. ¿Podrías revisar los reportes de testing que te envié?',
    timestamp: '2024-01-26 09:15',
    read: false,
    type: 'text'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Proyecto Actualizado',
    message: 'El progreso de tu proyecto "Sistema ERP PYME" se actualizó al 45%',
    type: 'info',
    timestamp: '2024-01-25 14:20',
    read: false,
    actionUrl: '/dashboard/projects'
  },
  {
    id: '2',
    title: 'Nueva Factura Disponible',
    message: 'La factura INV-2024-002 por $18,500 está lista para revisión',
    type: 'success',
    timestamp: '2024-01-24 16:30',
    read: false,
    actionUrl: '/dashboard/billing'
  },
  {
    id: '3',
    title: 'Documento Compartido',
    message: 'Se compartió contigo el documento "Manual de Usuario v2.0"',
    type: 'info',
    timestamp: '2024-01-24 11:20',
    read: true,
    actionUrl: '/dashboard/documents'
  },
  {
    id: '4',
    title: 'Reunión Programada',
    message: 'Demo del proyecto programada para el viernes 26/01 a las 15:00',
    type: 'warning',
    timestamp: '2024-01-23 18:45',
    read: true
  }
];

export default function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("vyntra-user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'client',
        senderName: user?.name || 'Cliente',
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        read: true,
        type: 'text'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simular respuesta del equipo
      setIsTyping(true);
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'team',
          senderName: 'María García - Project Manager',
          message: 'Gracias por tu mensaje. Hemos recibido tu consulta y te responderemos en breve. ¿Hay algo específico en lo que podamos ayudarte?',
          timestamp: new Date().toLocaleString(),
          read: false,
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-100 border-red-200 text-red-800';
      default: return 'bg-blue-100 border-blue-200 text-blue-800';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read && m.sender === 'team').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comunicación</h1>
          <p className="text-gray-600">Mantente en contacto con tu equipo de proyecto</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Equipo disponible</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mensajes sin leer</p>
              <p className="text-2xl font-bold text-blue-600">{unreadMessages}</p>
            </div>
            <div className="text-2xl">💬</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notificaciones</p>
              <p className="text-2xl font-bold text-purple-600">{unreadNotifications}</p>
            </div>
            <div className="text-2xl">🔔</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiempo de respuesta</p>
              <p className="text-2xl font-bold text-green-600">2h</p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'chat'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>💬</span>
              <span>Chat del Proyecto</span>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>🔔</span>
              <span>Notificaciones</span>
              {unreadNotifications > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'client'
                        ? 'bg-purple-600 text-white'
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-600 text-center italic'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.sender !== 'client' && message.type !== 'system' && (
                      <p className="text-xs font-medium mb-1 text-purple-600">{message.senderName}</p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    {message.attachments && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs bg-white bg-opacity-20 rounded p-2">
                            <span>📄</span>
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <p className="text-xs font-medium mb-1 text-purple-600">Equipo escribiendo...</p>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'ring-2 ring-purple-200' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <p className="text-xs mt-2 opacity-70">{notification.timestamp}</p>
                      {notification.actionUrl && (
                        <button className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-2">
                          Ver detalles →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors group">
            <div className="text-2xl">📞</div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600">Programar Reunión</h4>
              <p className="text-sm text-gray-600">Agenda una videollamada</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors group">
            <div className="text-2xl">❓</div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900 group-hover:text-green-600">Hacer Consulta</h4>
              <p className="text-sm text-gray-600">Envía una pregunta técnica</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors group">
            <div className="text-2xl">📋</div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900 group-hover:text-purple-600">Solicitar Demo</h4>
              <p className="text-sm text-gray-600">Pide una demostración</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 