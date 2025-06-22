# 📊 Arquitectura de Base de Datos - Vyntra

## 🏗️ Arquitectura Hexagonal

Esta carpeta implementa la capa de datos siguiendo arquitectura hexagonal:

```
domain/
├── entities/       # Entidades del dominio (Lead, Project, etc.)
├── ports/          # Interfaces (ILeadRepository)
└── use-cases/      # Lógica de negocio

infrastructure/
└── adapters/       # Implementaciones (SupabaseLeadRepository)

lib/database/
└── config/         # Configuración de Supabase
```

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Crear Tabla en Supabase

SQL para crear la tabla `leads`:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(50) NOT NULL CHECK (source IN ('chatbot', 'form', 'referral', 'social', 'direct')),
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
  message TEXT NOT NULL,
  value DECIMAL(10, 2),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  assigned_to VARCHAR(255),
  last_contact TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);
```

## 🚀 Uso

### Desde el formulario de contacto:

```typescript
import { CreateLeadUseCase } from '@/domain/use-cases/lead/CreateLeadUseCase';
import { SupabaseLeadRepository } from '@/infrastructure/adapters/SupabaseLeadRepository';

// Inyección de dependencias
const leadRepository = new SupabaseLeadRepository();
const createLeadUseCase = new CreateLeadUseCase(leadRepository);

// Crear lead
const lead = await createLeadUseCase.execute({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  source: LeadSource.FORM,
  message: 'Necesito información sobre sus servicios'
});
```

### Desde el dashboard:

```typescript
// Obtener todos los leads
const leads = await leadRepository.findAll();

// Obtener leads por estado
const newLeads = await leadRepository.findByStatus(LeadStatus.NEW);

// Actualizar lead
await leadRepository.update(leadId, {
  status: LeadStatus.CONTACTED,
  notes: 'Llamado realizado'
});
```

## 🔄 Migración Gradual

El sistema está diseñado para funcionar con o sin Supabase:

- **CON Supabase**: Usa la base de datos real
- **SIN Supabase**: Retorna arrays vacíos (no rompe la app)

Esto permite migrar gradualmente sin romper lo existente.

## ✅ Ventajas de esta Arquitectura

1. **Desacoplamiento**: La lógica de negocio no depende de Supabase
2. **Testeable**: Puedes crear mocks fácilmente
3. **Portable**: Cambiar de Supabase a otra BD es fácil
4. **Gradual**: No rompe lo existente mientras migras 