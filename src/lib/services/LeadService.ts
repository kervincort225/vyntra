import { CreateLeadUseCase } from '@/domain/use-cases/lead/CreateLeadUseCase';
import { GetAllLeadsUseCase } from '@/domain/use-cases/lead/GetAllLeadsUseCase';
import { LeadRepositoryFactory } from '@/lib/database/repositories/LeadRepositoryFactory';
import { CreateLeadDTO, Lead, LeadStatus, UpdateLeadDTO } from '@/domain/entities/Lead';

// Servicio que encapsula toda la lógica de leads
// Este es el punto de entrada para la UI
export class LeadService {
  private static instance: LeadService | null = null;
  private repository = LeadRepositoryFactory.getInstance();
  
  // Casos de uso
  private createLeadUseCase = new CreateLeadUseCase(this.repository);
  private getAllLeadsUseCase = new GetAllLeadsUseCase(this.repository);

  static getInstance(): LeadService {
    if (!this.instance) {
      this.instance = new LeadService();
    }
    return this.instance;
  }

  // Crear un nuevo lead
  async createLead(data: CreateLeadDTO): Promise<Lead> {
    return this.createLeadUseCase.execute(data);
  }

  // Obtener todos los leads
  async getAllLeads(): Promise<Lead[]> {
    return this.getAllLeadsUseCase.execute();
  }

  // Obtener lead por ID
  async getLeadById(id: string): Promise<Lead | null> {
    return this.repository.findById(id);
  }

  // Actualizar lead
  async updateLead(id: string, data: UpdateLeadDTO): Promise<Lead | null> {
    return this.repository.update(id, data);
  }

  // Obtener leads por estado
  async getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
    return this.repository.findByStatus(status);
  }

  // Obtener métricas
  async getLeadMetrics() {
    const [countByStatus, totalValue, conversionRate] = await Promise.all([
      this.repository.countByStatus(),
      this.repository.getTotalValue(),
      this.repository.getConversionRate()
    ]);

    return {
      countByStatus,
      totalValue,
      conversionRate
    };
  }

  // Método para verificar si está usando BD real o mock
  isUsingRealDatabase(): boolean {
    return process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined;
  }
} 