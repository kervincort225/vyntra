import { Lead, CreateLeadDTO, UpdateLeadDTO, LeadStatus, LeadSource } from '../entities/Lead';

// Puerto del dominio - Define qué necesitamos, no cómo se implementa
export interface ILeadRepository {
  // Operaciones básicas CRUD
  create(lead: CreateLeadDTO): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
  findAll(): Promise<Lead[]>;
  update(id: string, data: UpdateLeadDTO): Promise<Lead | null>;
  delete(id: string): Promise<boolean>;

  // Operaciones específicas del dominio
  findByStatus(status: LeadStatus): Promise<Lead[]>;
  findBySource(source: LeadSource): Promise<Lead[]>;
  findByAssignedTo(userId: string): Promise<Lead[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Lead[]>;
  
  // Métricas y estadísticas
  countByStatus(): Promise<{ status: LeadStatus; count: number }[]>;
  getTotalValue(): Promise<number>;
  getConversionRate(): Promise<number>;
} 