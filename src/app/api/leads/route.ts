import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { LeadService } from '@/lib/services/LeadService';

// Crear cliente de Supabase con service role (más seguro)
// Estas variables NO son NEXT_PUBLIC, solo existen en el servidor
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Función helper para determinar qué método usar
const hasSupabaseServiceKey = () => {
  return supabaseUrl && supabaseServiceKey;
};

export async function GET() {
  try {
    // Si tenemos service key, usar Supabase directamente
    if (hasSupabaseServiceKey()) {
      const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Fallback al servicio que ya tienes
      const leadService = LeadService.getInstance();
      const leads = await leadService.getAllLeads();
      return NextResponse.json(leads);
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Name and email are required' }, 
        { status: 400 }
      );
    }
    
    // Si tenemos service key, usar Supabase directamente
    if (hasSupabaseServiceKey()) {
      const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
      
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    } else {
      // Fallback al servicio que ya tienes
      const leadService = LeadService.getInstance();
      const lead = await leadService.createLead(body);
      return NextResponse.json(lead, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// Ejemplo de cómo usar esta API route desde el cliente:
// 
// // En lugar de usar LeadService directamente:
// const response = await fetch('/api/leads');
// const leads = await response.json();
//
// // Para crear un lead:
// const response = await fetch('/api/leads', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(leadData)
// });
// const newLead = await response.json(); 