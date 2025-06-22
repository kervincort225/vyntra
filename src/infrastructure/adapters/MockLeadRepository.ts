import { ILeadRepository } from '@/domain/ports/ILeadRepository';
import { Lead, CreateLeadDTO, UpdateLeadDTO, LeadStatus, LeadSource, LeadPriority } from '@/domain/entities/Lead';

// Mock repository que usa datos en memoria (útil para desarrollo y fallback)
export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[] = [
    {
      id: '1',
      name: 'Carlos Mendez',
      email: 'carlos@empresa.com',
      phone: '+56 9 1234 5678',
      company: 'Empresa Tecnológica',
      source: LeadSource.CHATBOT,
      status: LeadStatus.NEW,
      message: 'Interesado en automatización de procesos para su empresa. Necesita cotización urgente.',
      value: 15000,
      priority: LeadPriority.HIGH,
      assignedTo: 'Juan Pérez',
      notes: 'Cliente potencial muy interesado, seguir en 24h',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '2',
      name: 'Ana Rodriguez',
      email: 'ana@negocio.cl',
      phone: '+56 9 8765 4321',
      company: 'Negocio Digital',
      source: LeadSource.FORM,
      status: LeadStatus.CONTACTED,
      message: 'Necesita cotización para desarrollo de SaaS para su negocio',
      value: 25000,
      priority: LeadPriority.HIGH,
      assignedTo: 'María García',
      lastContact: new Date('2024-01-25'),
      notes: 'Reunión programada para el viernes',
      createdAt: new Date('2024-01-24'),
      updatedAt: new Date('2024-01-25')
    }
  ];

  async create(data: CreateLeadDTO): Promise<Lead> {
    const newLead: Lead = {
      id: Date.now().toString(),
      ...data,
      status: LeadStatus.NEW,
      priority: data.priority || LeadPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.leads.push(newLead);
    return newLead;
  }

  async findById(id: string): Promise<Lead | null> {
    return this.leads.find(lead => lead.id === id) || null;
  }

  async findAll(): Promise<Lead[]> {
    return [...this.leads].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async update(id: string, data: UpdateLeadDTO): Promise<Lead | null> {
    const index = this.leads.findIndex(lead => lead.id === id);
    if (index === -1) return null;

    this.leads[index] = {
      ...this.leads[index],
      ...data,
      updatedAt: new Date()
    };

    return this.leads[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.leads.findIndex(lead => lead.id === id);
    if (index === -1) return false;

    this.leads.splice(index, 1);
    return true;
  }

  async findByStatus(status: LeadStatus): Promise<Lead[]> {
    return this.leads
      .filter(lead => lead.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findBySource(source: LeadSource): Promise<Lead[]> {
    return this.leads
      .filter(lead => lead.source === source)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByAssignedTo(userId: string): Promise<Lead[]> {
    return this.leads
      .filter(lead => lead.assignedTo === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Lead[]> {
    return this.leads
      .filter(lead => 
        lead.createdAt >= startDate && lead.createdAt <= endDate
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async countByStatus(): Promise<{ status: LeadStatus; count: number }[]> {
    const counts = new Map<LeadStatus, number>();
    
    Object.values(LeadStatus).forEach(status => {
      counts.set(status, 0);
    });

    this.leads.forEach(lead => {
      counts.set(lead.status, (counts.get(lead.status) || 0) + 1);
    });

    return Array.from(counts.entries()).map(([status, count]) => ({
      status,
      count
    }));
  }

  async getTotalValue(): Promise<number> {
    return this.leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  }

  async getConversionRate(): Promise<number> {
    const total = this.leads.length;
    if (total === 0) return 0;

    const converted = this.leads.filter(
      lead => lead.status === LeadStatus.CONVERTED
    ).length;

    return (converted / total) * 100;
  }
} 