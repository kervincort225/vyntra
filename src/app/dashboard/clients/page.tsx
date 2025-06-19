"use client";
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'active' | 'inactive' | 'potential';
  totalProjects: number;
  totalValue: string;
  lastProject: string;
  joinDate: string;
  address?: string;
  website?: string;
  contactPerson: string;
  notes?: string;
  projects: {
    id: string;
    name: string;
    status: string;
    value: string;
    date: string;
  }[];
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ministerio de Obras Públicas',
    email: 'contacto@mop.gov.cl',
    phone: '+56 2 2449 3000',
    company: 'Ministerio de Obras Públicas',
    industry: 'Gobierno',
    status: 'active',
    totalProjects: 3,
    totalValue: '$75,000',
    lastProject: 'Portal de Licitaciones Gov',
    joinDate: '2023-06-15',
    address: 'Morandé 59, Santiago, Chile',
    website: 'www.mop.gov.cl',
    contactPerson: 'María González',
    notes: 'Cliente gubernamental importante. Siempre requiere documentación completa.',
    projects: [
      { id: '1', name: 'Portal de Licitaciones Gov', status: 'active', value: '$25,000', date: '2023-12-01' },
      { id: '2', name: 'Sistema de Seguimiento', status: 'completed', value: '$30,000', date: '2023-08-15' },
      { id: '3', name: 'App Móvil Inspecciones', status: 'completed', value: '$20,000', date: '2023-06-20' }
    ]
  },
  {
    id: '2',
    name: 'Distribuidora Central',
    email: 'sistemas@distribuidoracentral.cl',
    phone: '+56 2 2234 5678',
    company: 'Distribuidora Central S.A.',
    industry: 'Retail',
    status: 'active',
    totalProjects: 2,
    totalValue: '$43,500',
    lastProject: 'Sistema ERP PYME',
    joinDate: '2023-09-10',
    address: 'Av. Providencia 1234, Santiago',
    website: 'www.distribuidoracentral.cl',
    contactPerson: 'Carlos Mendoza',
    notes: 'Empresa familiar en crecimiento. Muy puntuales con los pagos.',
    projects: [
      { id: '4', name: 'Sistema ERP PYME', status: 'active', value: '$18,500', date: '2024-01-10' },
      { id: '5', name: 'E-commerce B2B', status: 'completed', value: '$25,000', date: '2023-10-01' }
    ]
  },
  {
    id: '3',
    name: 'Retail Express',
    email: 'tech@retailexpress.cl',
    phone: '+56 9 8765 4321',
    company: 'Retail Express Ltda.',
    industry: 'E-commerce',
    status: 'active',
    totalProjects: 1,
    totalValue: '$12,000',
    lastProject: 'App Móvil E-commerce',
    joinDate: '2023-11-05',
    address: 'Las Condes 567, Santiago',
    website: 'www.retailexpress.cl',
    contactPerson: 'Ana Rodríguez',
    projects: [
      { id: '6', name: 'App Móvil E-commerce', status: 'completed', value: '$12,000', date: '2023-11-15' }
    ]
  },
  {
    id: '4',
    name: 'Logística Plus',
    email: 'operaciones@logisticaplus.cl',
    phone: '+56 2 2987 6543',
    company: 'Logística Plus S.A.',
    industry: 'Logística',
    status: 'potential',
    totalProjects: 1,
    totalValue: '$22,000',
    lastProject: 'Automatización Inventario',
    joinDate: '2024-01-20',
    address: 'Zona Franca, Iquique',
    website: 'www.logisticaplus.cl',
    contactPerson: 'Roberto Fernández',
    notes: 'Cliente nuevo con gran potencial. Proyecto piloto en curso.',
    projects: [
      { id: '7', name: 'Automatización Inventario', status: 'pending', value: '$22,000', date: '2024-02-01' }
    ]
  },
  {
    id: '5',
    name: 'Contadores Asociados',
    email: 'info@contadoresasociados.cl',
    phone: '+56 2 2345 6789',
    company: 'Contadores Asociados Ltda.',
    industry: 'Servicios Profesionales',
    status: 'active',
    totalProjects: 1,
    totalValue: '$35,000',
    lastProject: 'Plataforma SaaS Contabilidad',
    joinDate: '2024-01-15',
    address: 'Providencia 890, Santiago',
    website: 'www.contadoresasociados.cl',
    contactPerson: 'Laura Sánchez',
    projects: [
      { id: '8', name: 'Plataforma SaaS Contabilidad', status: 'active', value: '$35,000', date: '2024-01-20' }
    ]
  },
  {
    id: '6',
    name: 'Centro Médico Salud',
    email: 'administracion@centromedicosalud.cl',
    phone: '+56 2 2456 7890',
    company: 'Centro Médico Salud S.A.',
    industry: 'Salud',
    status: 'inactive',
    totalProjects: 1,
    totalValue: '$12,000',
    lastProject: 'Sistema Gestión Clínica',
    joinDate: '2023-12-10',
    address: 'Ñuñoa 456, Santiago',
    contactPerson: 'Dr. Fernando Ramírez',
    notes: 'Proyecto cancelado por cambios internos. Mantener contacto para futuras oportunidades.',
    projects: [
      { id: '9', name: 'Sistema Gestión Clínica', status: 'cancelled', value: '$12,000', date: '2023-12-15' }
    ]
  }
];

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
    
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'potential': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'potential': return 'Potencial';
      default: return status;
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Gobierno': return '🏛️';
      case 'Retail': return '🛍️';
      case 'E-commerce': return '💻';
      case 'Logística': return '🚚';
      case 'Servicios Profesionales': return '💼';
      case 'Salud': return '🏥';
      default: return '🏢';
    }
  };

  const industries = [...new Set(clients.map(client => client.industry))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra tu cartera de clientes y su historial</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Exportar Lista
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
            + Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Potenciales</p>
              <p className="text-2xl font-bold text-yellow-600">
                {clients.filter(c => c.status === 'potential').length}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proyectos</p>
              <p className="text-2xl font-bold text-blue-600">
                {clients.reduce((sum, client) => sum + client.totalProjects, 0)}
              </p>
            </div>
            <div className="text-2xl">📁</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${clients.reduce((sum, client) => sum + parseInt(client.totalValue.replace(/[$,]/g, '')), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre, empresa o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="potential">Potencial</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industria</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las industrias</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div 
            key={client.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getIndustryIcon(client.industry)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                  {getStatusText(client.status)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contacto:</span>
                  <span className="text-sm font-medium text-gray-900">{client.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Proyectos:</span>
                  <span className="text-sm font-medium text-gray-900">{client.totalProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor Total:</span>
                  <span className="text-sm font-medium text-green-600">{client.totalValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Último Proyecto:</span>
                  <span className="text-xs text-gray-500 max-w-32 truncate">{client.lastProject}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Cliente desde {client.joinDate}
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Ver detalles →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-600">Ajusta los filtros o agrega un nuevo cliente</p>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getIndustryIcon(selectedClient.industry)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedClient.name}</h2>
                    <p className="text-gray-600">{selectedClient.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedClient.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <p className="text-gray-900">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Persona de Contacto</label>
                    <p className="text-gray-900">{selectedClient.contactPerson}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industria</label>
                    <p className="text-gray-900">{selectedClient.industry}</p>
                  </div>
                  {selectedClient.address && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <p className="text-gray-900">{selectedClient.address}</p>
                    </div>
                  )}
                  {selectedClient.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                      <a href={`https://${selectedClient.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        {selectedClient.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Comercial</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Proyectos</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedClient.totalProjects}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600">{selectedClient.totalValue}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Cliente Desde</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedClient.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Projects History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Proyectos</h3>
                <div className="space-y-3">
                  {selectedClient.projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">Iniciado: {project.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{project.value}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status === 'active' ? 'Activo' :
                           project.status === 'completed' ? 'Completado' :
                           project.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedClient.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                  Editar Cliente
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Nuevo Proyecto
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Enviar Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 