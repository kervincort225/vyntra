import { ILeadRepository } from '../../ports/ILeadRepository';
import { CreateLeadDTO, Lead, LeadStatus, LeadPriority } from '../../entities/Lead';

export class CreateLeadUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(data: CreateLeadDTO): Promise<Lead> {
    // Lógica de negocio: validaciones y reglas
    this.validateLeadData(data);
    
    // Asignar valores por defecto según reglas de negocio
    const leadToCreate: CreateLeadDTO = {
      ...data,
      priority: data.priority || this.calculatePriority(data),
    };

    // Crear el lead
    const lead = await this.leadRepository.create(leadToCreate);

    // Lógica post-creación (podría enviar notificaciones, etc.)
    // Por ahora solo retornamos el lead creado
    return lead;
  }

  private validateLeadData(data: CreateLeadDTO): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    if (!data.message || data.message.trim().length < 10) {
      throw new Error('El mensaje debe tener al menos 10 caracteres');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private calculatePriority(data: CreateLeadDTO): LeadPriority {
    // Lógica de negocio para calcular prioridad
    if (data.value && data.value > 30000) {
      return LeadPriority.HIGH;
    }
    
    if (data.source === 'referral') {
      return LeadPriority.HIGH;
    }

    if (data.source === 'chatbot' && data.message.toLowerCase().includes('urgente')) {
      return LeadPriority.HIGH;
    }

    return LeadPriority.MEDIUM;
  }
} 