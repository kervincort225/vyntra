import { ILeadRepository } from '@/domain/ports/ILeadRepository';
import { Lead, CreateLeadDTO, UpdateLeadDTO, LeadStatus, LeadSource, LeadPriority } from '@/domain/entities/Lead';
import { supabase, isSupabaseConfigured } from '@/lib/database/config/supabase';

// Adaptador que implementa el puerto usando Supabase
export class SupabaseLeadRepository implements ILeadRepository {
  private tableName = 'leads';

  async create(data: CreateLeadDTO): Promise<Lead> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase no está configurado');
    }

    const leadData = {
      ...data,
      status: LeadStatus.NEW,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: lead, error } = await supabase
      .from(this.tableName)
      .insert(leadData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creando lead: ${error.message}`);
    }

    return this.mapToEntity(lead);
  }

  async findById(id: string): Promise<Lead | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async findAll(): Promise<Lead[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(lead => this.mapToEntity(lead));
  }

  async update(id: string, updateData: UpdateLeadDTO): Promise<Lead | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    return !error;
  }

  async findByStatus(status: LeadStatus): Promise<Lead[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(lead => this.mapToEntity(lead));
  }

  async findBySource(source: LeadSource): Promise<Lead[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('source', source)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(lead => this.mapToEntity(lead));
  }

  async findByAssignedTo(userId: string): Promise<Lead[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(lead => this.mapToEntity(lead));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Lead[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(lead => this.mapToEntity(lead));
  }

  async countByStatus(): Promise<{ status: LeadStatus; count: number }[]> {
    if (!isSupabaseConfigured) return [];

    // Supabase no tiene GROUP BY directo, necesitamos hacer múltiples queries
    const statuses = Object.values(LeadStatus);
    const counts = await Promise.all(
      statuses.map(async (status) => {
        const { count } = await supabase
          .from(this.tableName)
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        
        return { status, count: count || 0 };
      })
    );

    return counts;
  }

  async getTotalValue(): Promise<number> {
    if (!isSupabaseConfigured) return 0;

    const { data, error } = await supabase
      .from(this.tableName)
      .select('value');

    if (error || !data) return 0;

    return data.reduce((sum, lead) => sum + (lead.value || 0), 0);
  }

  async getConversionRate(): Promise<number> {
    if (!isSupabaseConfigured) return 0;

    const { count: total } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    const { count: converted } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('status', LeadStatus.CONVERTED);

    if (!total || total === 0) return 0;

    return (converted || 0) / total * 100;
  }

  // Mapear datos de Supabase a entidad del dominio
  private mapToEntity(data: any): Lead {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      source: data.source as LeadSource,
      status: data.status as LeadStatus,
      message: data.message,
      value: data.value,
      priority: data.priority as LeadPriority,
      assignedTo: data.assigned_to,
      lastContact: data.last_contact ? new Date(data.last_contact) : undefined,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
} 