import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuración de Supabase - Singleton Pattern
class SupabaseConfig {
  private static instance: SupabaseClient | null = null;

  static getInstance(): SupabaseClient {
    if (!this.instance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // En desarrollo, lanzamos error
        if (process.env.NODE_ENV === 'development') {
          throw new Error(
            'Faltan variables de entorno de Supabase. Por favor configura:\n' +
            '- NEXT_PUBLIC_SUPABASE_URL\n' +
            '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
          );
        }
        
        // En producción, retornamos un cliente mock para no romper
        console.warn('⚠️  Supabase no configurado - usando modo offline');
        return {} as SupabaseClient;
      }

      this.instance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }

    return this.instance;
  }

  static isConfigured(): boolean {
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
}

export const supabase = SupabaseConfig.getInstance();
export const isSupabaseConfigured = SupabaseConfig.isConfigured(); 