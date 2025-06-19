"use client";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'invoice' | 'report' | 'presentation' | 'other';
  size: string;
  format: string;
  uploadDate: string;
  lastModified: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  status: 'draft' | 'review' | 'approved' | 'sent' | 'signed';
  tags: string[];
  description?: string;
  version: string;
  uploadedBy: string;
  url?: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrato Portal Licitaciones',
    type: 'contract',
    size: '2.5 MB',
    format: 'PDF',
    uploadDate: '2023-12-01',
    lastModified: '2024-01-15',
    projectId: '1',
    projectName: 'Portal de Licitaciones Gov',
    clientName: 'Ministerio de Obras Públicas',
    status: 'signed',
    tags: ['gobierno', 'contrato', 'licitaciones'],
    description: 'Contrato principal para el desarrollo del portal de licitaciones gubernamental',
    version: '2.1',
    uploadedBy: 'Juan Pérez'
  },
  {
    id: '2',
    name: 'Propuesta Sistema ERP',
    type: 'proposal',
    size: '8.2 MB',
    format: 'PDF',
    uploadDate: '2024-01-08',
    lastModified: '2024-01-10',
    projectId: '2',
    projectName: 'Sistema ERP PYME',
    clientName: 'Distribuidora Central',
    status: 'approved',
    tags: ['erp', 'propuesta', 'pyme'],
    description: 'Propuesta técnica y comercial para sistema ERP completo',
    version: '1.3',
    uploadedBy: 'María García'
  },
  {
    id: '3',
    name: 'Factura 001-2024',
    type: 'invoice',
    size: '156 KB',
    format: 'PDF',
    uploadDate: '2024-01-20',
    lastModified: '2024-01-20',
    projectId: '3',
    projectName: 'App Móvil E-commerce',
    clientName: 'Retail Express',
    status: 'sent',
    tags: ['factura', 'pago', 'enero'],
    description: 'Factura por desarrollo de aplicación móvil - Hito 3',
    version: '1.0',
    uploadedBy: 'Carlos Ruiz'
  },
  {
    id: '4',
    name: 'Reporte Avance Enero',
    type: 'report',
    size: '3.1 MB',
    format: 'PDF',
    uploadDate: '2024-01-31',
    lastModified: '2024-01-31',
    projectId: '5',
    projectName: 'Plataforma SaaS Contabilidad',
    clientName: 'Contadores Asociados',
    status: 'sent',
    tags: ['reporte', 'avance', 'saas'],
    description: 'Reporte mensual de avance del proyecto SaaS',
    version: '1.0',
    uploadedBy: 'Ana López'
  },
  {
    id: '5',
    name: 'Presentación Demo ERP',
    type: 'presentation',
    size: '15.7 MB',
    format: 'PPTX',
    uploadDate: '2024-01-15',
    lastModified: '2024-01-18',
    projectId: '2',
    projectName: 'Sistema ERP PYME',
    clientName: 'Distribuidora Central',
    status: 'review',
    tags: ['demo', 'presentación', 'erp'],
    description: 'Presentación de demostración del sistema ERP para cliente',
    version: '2.0',
    uploadedBy: 'Pedro Martínez'
  },
  {
    id: '6',
    name: 'Manual Usuario Portal',
    type: 'other',
    size: '4.8 MB',
    format: 'PDF',
    uploadDate: '2024-01-10',
    lastModified: '2024-01-12',
    projectId: '1',
    projectName: 'Portal de Licitaciones Gov',
    clientName: 'Ministerio de Obras Públicas',
    status: 'draft',
    tags: ['manual', 'usuario', 'documentación'],
    description: 'Manual de usuario para el portal de licitaciones',
    version: '1.5',
    uploadedBy: 'Sofia Torres'
  },
  {
    id: '7',
    name: 'Cotización Automatización',
    type: 'proposal',
    size: '1.2 MB',
    format: 'PDF',
    uploadDate: '2024-01-25',
    lastModified: '2024-01-25',
    projectId: '4',
    projectName: 'Automatización Inventario',
    clientName: 'Logística Plus',
    status: 'sent',
    tags: ['cotización', 'automatización', 'inventario'],
    description: 'Cotización para sistema de automatización de inventario',
    version: '1.0',
    uploadedBy: 'Roberto Fernández'
  },
  {
    id: '8',
    name: 'Acuerdo Confidencialidad',
    type: 'contract',
    size: '890 KB',
    format: 'PDF',
    uploadDate: '2024-01-12',
    lastModified: '2024-01-12',
    clientName: 'Contadores Asociados',
    status: 'signed',
    tags: ['nda', 'confidencialidad', 'legal'],
    description: 'Acuerdo de confidencialidad con cliente',
    version: '1.0',
    uploadedBy: 'Laura Sánchez'
  }
];

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.projectName && doc.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (doc.clientName && doc.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'invoice': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-orange-100 text-orange-800';
      case 'presentation': return 'bg-pink-100 text-pink-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'contract': return 'Contrato';
      case 'proposal': return 'Propuesta';
      case 'invoice': return 'Factura';
      case 'report': return 'Reporte';
      case 'presentation': return 'Presentación';
      case 'other': return 'Otro';
      default: return type;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'review': return 'En Revisión';
      case 'approved': return 'Aprobado';
      case 'sent': return 'Enviado';
      case 'signed': return 'Firmado';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return '📄';
      case 'proposal': return '📋';
      case 'invoice': return '🧾';
      case 'report': return '📊';
      case 'presentation': return '📽️';
      case 'other': return '📁';
      default: return '📄';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return '📕';
      case 'doc':
      case 'docx': return '📘';
      case 'xls':
      case 'xlsx': return '📗';
      case 'ppt':
      case 'pptx': return '📙';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-gray-600">Organiza y administra todos tus documentos de proyectos</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cuadrícula
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
            + Subir Documento
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="text-2xl">📄</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes Revisión</p>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === 'review').length}
              </p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Firmados</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'signed').length}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tamaño Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(documents.reduce((sum, doc) => {
                  const size = parseFloat(doc.size.replace(/[^\d.]/g, ''));
                  return sum + (doc.size.includes('MB') ? size : size / 1000);
                }, 0) * 10) / 10} MB
              </p>
            </div>
            <div className="text-2xl">💾</div>
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
              placeholder="Buscar por nombre, proyecto, cliente o etiqueta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="contract">Contratos</option>
              <option value="proposal">Propuestas</option>
              <option value="invoice">Facturas</option>
              <option value="report">Reportes</option>
              <option value="presentation">Presentaciones</option>
              <option value="other">Otros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="review">En Revisión</option>
              <option value="approved">Aprobado</option>
              <option value="sent">Enviado</option>
              <option value="signed">Firmado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{getFormatIcon(doc.format)}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                    {getStatusText(doc.status)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{doc.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Tipo:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(doc.type)}`}>
                      {getTypeText(doc.type)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Tamaño:</span>
                    <span className="text-xs text-gray-900">{doc.size}</span>
                  </div>
                  {doc.projectName && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Proyecto:</span>
                      <span className="text-xs text-gray-900 truncate max-w-24">{doc.projectName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {doc.uploadDate}
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Ver →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{getFormatIcon(doc.format)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">v{doc.version} • {doc.uploadedBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(doc.type)}`}>
                        {getTypeText(doc.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.projectName || '-'}</div>
                      <div className="text-sm text-gray-500">{doc.clientName || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploadDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Ver
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Descargar
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Compartir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
          <p className="text-gray-600">Ajusta los filtros o sube un nuevo documento</p>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getFormatIcon(selectedDocument.format)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedDocument.name}</h2>
                    <p className="text-gray-600">Versión {selectedDocument.version}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDocument(null)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedDocument.type)}`}>
                    {getTypeText(selectedDocument.type)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedDocument.status)}`}>
                    {getStatusText(selectedDocument.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                  <p className="text-gray-900">{selectedDocument.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                  <p className="text-gray-900">{selectedDocument.format}</p>
                </div>
                {selectedDocument.projectName && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                      <p className="text-gray-900">{selectedDocument.projectName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                      <p className="text-gray-900">{selectedDocument.clientName}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subido por</label>
                  <p className="text-gray-900">{selectedDocument.uploadedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de subida</label>
                  <p className="text-gray-900">{selectedDocument.uploadDate}</p>
                </div>
              </div>

              {selectedDocument.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedDocument.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                  Descargar
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Compartir
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 