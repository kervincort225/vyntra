import { ILeadRepository } from '@/domain/ports/ILeadRepository';
import { SupabaseLeadRepository } from '@/infrastructure/adapters/SupabaseLeadRepository';
import { MockLeadRepository } from '@/infrastructure/adapters/MockLeadRepository';
import { isSupabaseConfigured } from '../config/supabase';

// Factory pattern para decidir qué implementación usar
export class LeadRepositoryFactory {
  private static instance: ILeadRepository | null = null;

  static getInstance(): ILeadRepository {
    if (!this.instance) {
      // Si Supabase está configurado, usar el repositorio real
      if (isSupabaseConfigured) {
        console.log('✅ Usando Supabase para leads');
        this.instance = new SupabaseLeadRepository();
      } else {
        // Si no, usar el mock (no rompe la app)
        console.log('⚠️  Usando datos mock para leads (configura Supabase)');
        this.instance = new MockLeadRepository();
      }
    }

    return this.instance;
  }

  // Método para forzar el uso de mock (útil para tests)
  static useMock(): void {
    this.instance = new MockLeadRepository();
  }

  // Método para resetear (útil para tests)
  static reset(): void {
    this.instance = null;
  }
} 