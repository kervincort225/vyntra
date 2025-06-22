import { ILeadRepository } from '../../ports/ILeadRepository';
import { Lead } from '../../entities/Lead';

export class GetAllLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(): Promise<Lead[]> {
    // Aquí podríamos agregar lógica de negocio como:
    // - Filtrar leads según permisos del usuario
    // - Ordenar según criterios de negocio
    // - Enriquecer con datos adicionales
    
    const leads = await this.leadRepository.findAll();
    
    // Por ahora retornamos todos los leads
    return leads;
  }
} 