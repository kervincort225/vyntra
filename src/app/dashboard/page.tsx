"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
}

interface Metric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  progress: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  source: 'chatbot' | 'form' | 'referral';
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  date: string;
  message: string;
}

interface ClientMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;
}

// Datos para admin (existentes)
const mockMetrics: Metric[] = [
  {
    id: 'projects',
    label: 'Proyectos Activos',
    value: '12',
    change: '+2 este mes',
    changeType: 'positive',
    icon: '📁'
  },
  {
    id: 'leads',
    label: 'Leads Nuevos',
    value: '24',
    change: '+8 esta semana',
    changeType: 'positive',
    icon: '👥'
  },
  {
    id: 'revenue',
    label: 'Ingresos',
    value: '$45,200',
    change: '+12% vs mes anterior',
    changeType: 'positive',
    icon: '💰'
  },
  {
    id: 'satisfaction',
    label: 'Satisfacción',
    value: '98%',
    change: '+2% este trimestre',
    changeType: 'positive',
    icon: '⭐'
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Portal de Licitaciones Gov',
    client: 'Ministerio de Obras Públicas',
    status: 'active',
    progress: 75,
    deadline: '2024-02-15',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Sistema ERP PYME',
    client: 'Distribuidora Central',
    status: 'active',
    progress: 45,
    deadline: '2024-03-01',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'App Móvil E-commerce',
    client: 'Retail Express',
    status: 'completed',
    progress: 100,
    deadline: '2024-01-20',
    priority: 'low'
  },
  {
    id: '4',
    name: 'Automatización Inventario',
    client: 'Logística Plus',
    status: 'pending',
    progress: 0,
    deadline: '2024-04-10',
    priority: 'medium'
  }
];

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Mendez',
    email: 'carlos@empresa.com',
    source: 'chatbot',
    status: 'new',
    date: '2024-01-25',
    message: 'Interesado en automatización de procesos'
  },
  {
    id: '2',
    name: 'Ana Rodriguez',
    email: 'ana@negocio.cl',
    source: 'form',
    status: 'contacted',
    date: '2024-01-24',
    message: 'Necesita cotización para SaaS'
  },
  {
    id: '3',
    name: 'Luis Torres',
    email: 'luis@startup.com',
    source: 'referral',
    status: 'qualified',
    date: '2024-01-23',
    message: 'Startup busca desarrollo completo'
  }
];

// Datos específicos para clientes
const clientMetrics: ClientMetric[] = [
  {
    id: 'project-progress',
    label: 'Progreso del Proyecto',
    value: '45%',
    icon: '📊',
    description: 'Sistema ERP PYME en desarrollo'
  },
  {
    id: 'next-milestone',
    label: 'Próximo Hito',
    value: '7 días',
    icon: '🎯',
    description: 'Entrega del módulo de inventario'
  },
  {
    id: 'team-response',
    label: 'Tiempo de Respuesta',
    value: '2 horas',
    icon: '⚡',
    description: 'Promedio de respuesta del equipo'
  },
  {
    id: 'satisfaction',
    label: 'Satisfacción',
    value: '5/5',
    icon: '⭐',
    description: 'Calificación del servicio'
  }
];

const clientProjects: Project[] = [
  {
    id: '2',
    name: 'Sistema ERP PYME',
    client: 'Tu Empresa',
    status: 'active',
    progress: 45,
    deadline: '2024-03-01',
    priority: 'high',
    description: 'Desarrollo de sistema ERP completo con módulos de inventario, facturación y reportes'
  }
];

const clientNotifications = [
  {
    id: '1',
    title: 'Actualización de Progreso',
    message: 'Tu proyecto avanzó al 45%. El módulo de autenticación está completo.',
    time: '2 horas',
    type: 'success'
  },
  {
    id: '2',
    title: 'Próxima Reunión',
    message: 'Demo programada para el viernes 26/01 a las 15:00',
    time: '1 día',
    type: 'info'
  },
  {
    id: '3',
    title: 'Documento Compartido',
    message: 'Se compartió contigo "Manual de Usuario v2.0"',
    time: '3 días',
    type: 'info'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("vyntra-user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Determinar saludo según hora
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Buenos días');
    else if (hour < 18) setTimeOfDay('Buenas tardes');
    else setTimeOfDay('Buenas noches');

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Renderizar dashboard específico según el rol
  if (user?.role === 'client') {
    return <ClientDashboard user={user} timeOfDay={timeOfDay} />;
  }

  return <AdminDashboard user={user} timeOfDay={timeOfDay} />;
}

// Dashboard para clientes
function ClientDashboard({ user, timeOfDay }: { user: User; timeOfDay: string }) {
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
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {timeOfDay}, {user.name}! 👋
        </h1>
        <p className="text-blue-100">
          Bienvenido a tu portal de cliente. Aquí puedes seguir el progreso de tu proyecto y comunicarte con nuestro equipo.
        </p>
      </div>

      {/* Client Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clientMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{metric.icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-gray-700 mb-1">{metric.label}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tu Proyecto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tu Proyecto</h2>
              <a href="/dashboard/projects" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Ver detalles →
              </a>
            </div>
          </div>
          <div className="p-6">
            {clientProjects.map((project) => (
              <div key={project.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    En Progreso
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progreso general</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fecha de entrega</span>
                  <span className="font-medium text-gray-900">{project.deadline}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Última Actualización</h4>
                  <p className="text-sm text-gray-600">
                    Se completó el módulo de autenticación. Próximamente comenzaremos con el módulo de inventario.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Hace 2 horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notificaciones Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
              <a href="/dashboard/communication" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Ver todas →
              </a>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {clientNotifications.map((notification) => (
              <div key={notification.id} className={`p-4 rounded-lg border ${getNotificationColor(notification.type)}`}>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">Hace {notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas para Cliente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/dashboard/communication" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors group">
            <div className="text-2xl">💬</div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600">Contactar Equipo</h3>
              <p className="text-sm text-gray-600">Envía un mensaje o consulta</p>
            </div>
          </a>
          
          <a href="/dashboard/documents" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors group">
            <div className="text-2xl">📄</div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-green-600">Ver Documentos</h3>
              <p className="text-sm text-gray-600">Accede a tus archivos</p>
            </div>
          </a>
          
          <a href="/dashboard/billing" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors group">
            <div className="text-2xl">💰</div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-purple-600">Ver Facturas</h3>
              <p className="text-sm text-gray-600">Revisa tus pagos</p>
            </div>
          </a>
        </div>
      </div>

      {/* Equipo de Proyecto */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tu Equipo de Proyecto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              MG
            </div>
            <div>
              <h3 className="font-medium text-gray-900">María García</h3>
              <p className="text-sm text-gray-600">Project Manager</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Disponible</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              CR
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Carlos Ruiz</h3>
              <p className="text-sm text-gray-600">Desarrollador Senior</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Disponible</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              AL
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Ana López</h3>
              <p className="text-sm text-gray-600">QA Tester</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Ocupada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard para administradores (el actual)
function AdminDashboard({ user, timeOfDay }: { user: User | null; timeOfDay: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'chatbot': return '🤖';
      case 'form': return '📝';
      case 'referral': return '👥';
      default: return '📧';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {timeOfDay}, {user?.name || 'Usuario'}! 👋
        </h1>
        <p className="text-purple-100">
          Aquí tienes un resumen de tu actividad reciente y métricas importantes.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{metric.icon}</div>
              <div className={`text-sm px-2 py-1 rounded-full ${
                metric.changeType === 'positive' ? 'bg-green-100 text-green-600' :
                metric.changeType === 'negative' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Proyectos Recientes</h2>
              <a href="/dashboard/projects" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Ver todos →
              </a>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {mockProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status === 'active' ? 'Activo' :
                       project.status === 'completed' ? 'Completado' :
                       project.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.client}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className={`text-lg ${getPriorityColor(project.priority)}`}>
                    {project.priority === 'high' ? '🔴' : 
                     project.priority === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Leads Recientes</h2>
              <a href="/dashboard/leads" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Ver todos →
              </a>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {mockLeads.map((lead) => (
              <div key={lead.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-2xl">{getSourceIcon(lead.source)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-gray-900">{lead.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status === 'new' ? 'Nuevo' :
                       lead.status === 'contacted' ? 'Contactado' :
                       lead.status === 'qualified' ? 'Calificado' : 'Convertido'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{lead.email}</p>
                  <p className="text-xs text-gray-500 truncate">{lead.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{lead.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors group">
            <div className="text-2xl">📁</div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-purple-600">Nuevo Proyecto</h3>
              <p className="text-sm text-gray-600">Crear un proyecto nuevo</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors group">
            <div className="text-2xl">👥</div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600">Gestionar Leads</h3>
              <p className="text-sm text-gray-600">Revisar leads pendientes</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors group">
            <div className="text-2xl">📊</div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-green-600">Ver Reportes</h3>
              <p className="text-sm text-gray-600">Analizar métricas</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 