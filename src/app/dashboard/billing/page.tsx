"use client";
import { useState } from "react";

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  projectName: string;
  amount: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  description: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    clientName: 'Ministerio de Obras Públicas',
    projectName: 'Portal de Licitaciones Gov',
    amount: 21008,
    tax: 3992,
    total: 25000,
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    status: 'paid',
    paymentMethod: 'Transferencia',
    paymentDate: '2024-01-20',
    description: 'Desarrollo Portal de Licitaciones - Hito 3',
    items: [
      { description: 'Desarrollo Backend API', quantity: 80, unitPrice: 150, total: 12000 },
      { description: 'Desarrollo Frontend', quantity: 60, unitPrice: 120, total: 7200 },
      { description: 'Integración ChileCompra', quantity: 1, unitPrice: 1808, total: 1808 }
    ]
  },
  {
    id: '2',
    number: 'INV-2024-002',
    clientName: 'Distribuidora Central',
    projectName: 'Sistema ERP PYME',
    amount: 15546,
    tax: 2954,
    total: 18500,
    issueDate: '2024-01-20',
    dueDate: '2024-02-19',
    status: 'sent',
    description: 'Sistema ERP - Módulo de Inventario',
    items: [
      { description: 'Análisis y Diseño', quantity: 40, unitPrice: 200, total: 8000 },
      { description: 'Desarrollo Módulo Inventario', quantity: 50, unitPrice: 150, total: 7500 },
      { description: 'Testing y QA', quantity: 1, unitPrice: 46, total: 46 }
    ]
  },
  {
    id: '3',
    number: 'INV-2024-003',
    clientName: 'Retail Express',
    projectName: 'App Móvil E-commerce',
    amount: 10084,
    tax: 1916,
    total: 12000,
    issueDate: '2024-01-10',
    dueDate: '2024-02-09',
    status: 'paid',
    paymentMethod: 'Transferencia',
    paymentDate: '2024-01-15',
    description: 'Aplicación Móvil - Entrega Final',
    items: [
      { description: 'Desarrollo App iOS/Android', quantity: 60, unitPrice: 150, total: 9000 },
      { description: 'Integración Pasarela de Pagos', quantity: 1, unitPrice: 1084, total: 1084 }
    ]
  },
  {
    id: '4',
    number: 'INV-2024-004',
    clientName: 'Contadores Asociados',
    projectName: 'Plataforma SaaS Contabilidad',
    amount: 29412,
    tax: 5588,
    total: 35000,
    issueDate: '2024-01-25',
    dueDate: '2024-02-24',
    status: 'sent',
    description: 'Plataforma SaaS - Primer Hito',
    items: [
      { description: 'Arquitectura y Setup Inicial', quantity: 80, unitPrice: 200, total: 16000 },
      { description: 'Módulo de Usuarios', quantity: 40, unitPrice: 180, total: 7200 },
      { description: 'Dashboard Principal', quantity: 35, unitPrice: 175, total: 6125 },
      { description: 'Documentación Técnica', quantity: 1, unitPrice: 87, total: 87 }
    ]
  },
  {
    id: '5',
    number: 'INV-2024-005',
    clientName: 'Logística Plus',
    projectName: 'Automatización Inventario',
    amount: 18487,
    tax: 3513,
    total: 22000,
    issueDate: '2024-01-30',
    dueDate: '2024-03-01',
    status: 'draft',
    description: 'Sistema de Automatización - Propuesta Inicial',
    items: [
      { description: 'Análisis de Requerimientos', quantity: 30, unitPrice: 250, total: 7500 },
      { description: 'Diseño de Sistema', quantity: 40, unitPrice: 200, total: 8000 },
      { description: 'Prototipo Inicial', quantity: 20, unitPrice: 149, total: 2980 },
      { description: 'Documentación', quantity: 1, unitPrice: 7, total: 7 }
    ]
  },
  {
    id: '6',
    number: 'INV-2023-045',
    clientName: 'Centro Médico Salud',
    projectName: 'Sistema Gestión Clínica',
    amount: 8403,
    tax: 1597,
    total: 10000,
    issueDate: '2023-12-20',
    dueDate: '2024-01-19',
    status: 'overdue',
    description: 'Sistema de Gestión - Trabajo Realizado',
    items: [
      { description: 'Desarrollo Parcial', quantity: 30, unitPrice: 280, total: 8400 },
      { description: 'Ajuste Final', quantity: 1, unitPrice: 3, total: 3 }
    ]
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 25000,
    date: '2024-01-20',
    method: 'Transferencia Bancaria',
    reference: 'TRF-2024-001',
    status: 'completed'
  },
  {
    id: '2',
    invoiceId: '3',
    amount: 12000,
    date: '2024-01-15',
    method: 'Transferencia Bancaria',
    reference: 'TRF-2024-002',
    status: 'completed'
  }
];

export default function BillingPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'reports'>('invoices');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviada';
      case 'paid': return 'Pagada';
      case 'overdue': return 'Vencida';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-600">Administra facturas, pagos y reportes financieros</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Exportar
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
            + Nueva Factura
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendiente de Pago</p>
              <p className="text-2xl font-bold text-blue-600">
                ${pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Facturas Vencidas</p>
              <p className="text-2xl font-bold text-red-600">
                ${overdueAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">🚨</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facturas</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.length}
              </p>
            </div>
            <div className="text-2xl">📄</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Facturas
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pagos
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reportes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                  <input
                    type="text"
                    placeholder="Buscar por número, cliente o proyecto..."
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
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="paid">Pagada</option>
                    <option value="overdue">Vencida</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proyecto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                          <div className="text-sm text-gray-500">{invoice.issueDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.clientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.projectName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${invoice.total.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {invoice.dueDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Ver
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              Editar
                            </button>
                            {invoice.status === 'draft' && (
                              <button className="text-green-600 hover:text-green-900">
                                Enviar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Historial de Pagos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => {
                      const invoice = invoices.find(inv => inv.id === payment.invoiceId);
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {invoice?.number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice?.clientName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-green-600">
                              ${payment.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.method}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{payment.reference || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'completed' ? 'Completado' :
                               payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Reportes Financieros</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Resumen Mensual</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Facturas Emitidas:</span>
                      <span className="font-medium">{invoices.filter(inv => inv.issueDate.startsWith('2024-01')).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ingresos del Mes:</span>
                      <span className="font-medium text-green-600">
                        ${invoices.filter(inv => inv.status === 'paid' && inv.paymentDate?.startsWith('2024-01')).reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pendiente de Cobro:</span>
                      <span className="font-medium text-blue-600">
                        ${invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Estados de Facturación</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Borradores:</span>
                      <span className="font-medium">{invoices.filter(inv => inv.status === 'draft').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enviadas:</span>
                      <span className="font-medium">{invoices.filter(inv => inv.status === 'sent').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pagadas:</span>
                      <span className="font-medium text-green-600">{invoices.filter(inv => inv.status === 'paid').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vencidas:</span>
                      <span className="font-medium text-red-600">{invoices.filter(inv => inv.status === 'overdue').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Factura {selectedInvoice.number}</h2>
                  <p className="text-gray-600">{selectedInvoice.clientName}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Información de Factura</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número:</span>
                      <span className="font-medium">{selectedInvoice.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha Emisión:</span>
                      <span>{selectedInvoice.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha Vencimiento:</span>
                      <span>{selectedInvoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                        {getStatusText(selectedInvoice.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Información del Cliente</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">{selectedInvoice.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proyecto:</span>
                      <span>{selectedInvoice.projectName}</span>
                    </div>
                    {selectedInvoice.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha Pago:</span>
                        <span className="text-green-600">{selectedInvoice.paymentDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Detalle de Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">${item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">${item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (19%):</span>
                    <span className="font-medium">${selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                  Descargar PDF
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Enviar por Email
                </button>
                {selectedInvoice.status === 'draft' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Marcar como Enviada
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 