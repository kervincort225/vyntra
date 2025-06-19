"use client";
import { useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'chatbot' | 'form' | 'referral' | 'social' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';
  date: string;
  message: string;
  value?: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  lastContact?: string;
  notes?: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Mendez',
    email: 'carlos@empresa.com',
    phone: '+56 9 1234 5678',
    company: 'Empresa Tecnológica',
    source: 'chatbot',
    status: 'new',
    date: '2024-01-25',
    message: 'Interesado en automatización de procesos para su empresa. Necesita cotización urgente.',
    value: '$15,000',
    priority: 'high',
    assignedTo: 'Juan Pérez',
    notes: 'Cliente potencial muy interesado, seguir en 24h'
  },
  {
    id: '2',
    name: 'Ana Rodriguez',
    email: 'ana@negocio.cl',
    phone: '+56 9 8765 4321',
    company: 'Negocio Digital',
    source: 'form',
    status: 'contacted',
    date: '2024-01-24',
    message: 'Necesita cotización para desarrollo de SaaS para su negocio',
    value: '$25,000',
    priority: 'high',
    assignedTo: 'María García',
    lastContact: '2024-01-25',
    notes: 'Reunión programada para el viernes'
  },
  {
    id: '3',
    name: 'Luis Torres',
    email: 'luis@startup.com',
    phone: '+56 9 5555 1234',
    company: 'StartupTech',
    source: 'referral',
    status: 'qualified',
    date: '2024-01-23',
    message: 'Startup busca desarrollo completo de plataforma web',
    value: '$35,000',
    priority: 'medium',
    assignedTo: 'Carlos Ruiz',
    lastContact: '2024-01-24',
    notes: 'Presupuesto confirmado, esperando decisión'
  },
  {
    id: '4',
    name: 'Patricia Silva',
    email: 'patricia@consultora.com',
    company: 'Consultora Legal',
    source: 'social',
    status: 'proposal',
    date: '2024-01-22',
    message: 'Interesada en sistema de gestión de casos legales',
    value: '$18,000',
    priority: 'medium',
    assignedTo: 'Ana López',
    lastContact: '2024-01-23',
    notes: 'Propuesta enviada, esperando respuesta'
  },
  {
    id: '5',
    name: 'Roberto Morales',
    email: 'roberto@retail.cl',
    phone: '+56 9 7777 8888',
    company: 'Retail Solutions',
    source: 'direct',
    status: 'converted',
    date: '2024-01-20',
    message: 'Necesita e-commerce completo con inventario',
    value: '$22,000',
    priority: 'low',
    assignedTo: 'Pedro Martínez',
    lastContact: '2024-01-22',
    notes: 'Proyecto iniciado exitosamente'
  },
  {
    id: '6',
    name: 'Carmen Vega',
    email: 'carmen@salud.com',
    company: 'Centro de Salud',
    source: 'form',
    status: 'lost',
    date: '2024-01-18',
    message: 'Sistema de gestión de pacientes',
    value: '$12,000',
    priority: 'low',
    assignedTo: 'Sofia Torres',
    lastContact: '2024-01-20',
    notes: 'Decidió por otra opción'
  }
];

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesSource && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-purple-100 text-purple-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'chatbot': return '🤖';
      case 'form': return '📝';
      case 'referral': return '👥';
      case 'social': return '📱';
      case 'direct': return '📞';
      default: return '📧';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo';
      case 'contacted': return 'Contactado';
      case 'qualified': return 'Calificado';
      case 'proposal': return 'Propuesta';
      case 'converted': return 'Convertido';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case 'chatbot': return 'Chatbot';
      case 'form': return 'Formulario';
      case 'referral': return 'Referido';
      case 'social': return 'Redes Sociales';
      case 'direct': return 'Directo';
      default: return source;
    }
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    // En producción, aquí se haría la llamada a la API
    console.log(`Cambiando estado del lead ${leadId} a ${newStatus}`);
  };

  const handleAddNote = () => {
    if (selectedLead && newNote.trim()) {
      // En producción, aquí se guardaría la nota
      console.log(`Agregando nota al lead ${selectedLead.id}: ${newNote}`);
      setNewNote('');
      setShowNoteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Leads</h1>
          <p className="text-gray-600">Administra y da seguimiento a todos tus leads</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Exportar
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
            + Nuevo Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leads Nuevos</p>
              <p className="text-2xl font-bold text-purple-600">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
            <div className="text-2xl">🆕</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter(l => ['contacted', 'qualified', 'proposal'].includes(l.status)).length}
              </p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Convertidos</p>
              <p className="text-2xl font-bold text-green-600">
                {leads.filter(l => l.status === 'converted').length}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${leads.reduce((sum, lead) => sum + (parseInt(lead.value?.replace(/[$,]/g, '') || '0')), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre, email o empresa..."
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
              <option value="new">Nuevo</option>
              <option value="contacted">Contactado</option>
              <option value="qualified">Calificado</option>
              <option value="proposal">Propuesta</option>
              <option value="converted">Convertido</option>
              <option value="lost">Perdido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las fuentes</option>
              <option value="chatbot">Chatbot</option>
              <option value="form">Formulario</option>
              <option value="referral">Referido</option>
              <option value="social">Redes Sociales</option>
              <option value="direct">Directo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        {lead.company && (
                          <div className="text-xs text-gray-400">{lead.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getSourceIcon(lead.source)}</span>
                      <span className="text-sm text-gray-900">{getSourceText(lead.source)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {getStatusText(lead.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.value || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                      {lead.priority === 'high' ? 'Alta' : lead.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.assignedTo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Ver
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Editar
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Convertir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron leads</h3>
          <p className="text-gray-600">Ajusta los filtros o agrega un nuevo lead</p>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <p className="text-gray-900">{selectedLead.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <p className="text-gray-900">{selectedLead.company || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
                  <p className="text-gray-900">{selectedLead.value || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getSourceIcon(selectedLead.source)}</span>
                    <span>{getSourceText(selectedLead.source)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="qualified">Calificado</option>
                    <option value="proposal">Propuesta</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
                  <p className="text-gray-900">{selectedLead.assignedTo || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Último Contacto</label>
                  <p className="text-gray-900">{selectedLead.lastContact || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje Inicial</label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
              </div>

              {selectedLead.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Agregar Nota
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Enviar Email
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Programar Llamada
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Nota</h3>
            </div>
            <div className="p-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe tu nota aquí..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Guardar Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 