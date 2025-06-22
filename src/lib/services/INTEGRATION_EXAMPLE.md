# 🔌 Guía de Integración - Base de Datos Vyntra

## 📋 Resumen de lo Creado

### Estructura de Arquitectura Hexagonal:
```
src/
├── domain/                    # Lógica de negocio pura
│   ├── entities/             # Lead.ts
│   ├── ports/                # ILeadRepository.ts
│   └── use-cases/            # CreateLeadUseCase.ts, GetAllLeadsUseCase.ts
├── infrastructure/           # Implementaciones externas
│   └── adapters/            # SupabaseLeadRepository.ts, MockLeadRepository.ts
└── lib/
    ├── database/            # Configuración BD
    └── services/            # LeadService.ts (punto de entrada)
```

## 🚀 Cómo Integrar SIN Romper lo Existente

### 1️⃣ En el Formulario de Contacto (src/app/page.tsx)

**ANTES:**
```typescript
// Solo enviaba email
const result = await sendContactForm(formData);
```

**DESPUÉS:**
```typescript
import { LeadService } from '@/lib/services/LeadService';
import { LeadSource } from '@/domain/entities/Lead';

// Enviar email (NO TOCAMOS)
const result = await sendContactForm(formData);

// AGREGAR: Guardar en BD también
if (result.success) {
  try {
    const leadService = LeadService.getInstance();
    await leadService.createLead({
      name: formData.name,
      email: formData.email,
      source: LeadSource.FORM,
      message: formData.message,
      // Mapear el servicio a un valor estimado
      value: formData.service === 'licitaciones' ? 25000 : 15000
    });
    console.log('✅ Lead guardado en BD');
  } catch (error) {
    console.log('⚠️ No se pudo guardar en BD, pero el email se envió');
    // NO rompemos el flujo si falla la BD
  }
}
```

### 2️⃣ En el Dashboard de Leads (src/app/dashboard/leads/page.tsx)

**ANTES:**
```typescript
const mockLeads: Lead[] = [
  // Datos hardcodeados
];
```

**DESPUÉS:**
```typescript
import { LeadService } from '@/lib/services/LeadService';
import { useState, useEffect } from 'react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadLeads();
  }, []);
  
  const loadLeads = async () => {
    try {
      const leadService = LeadService.getInstance();
      const dbLeads = await leadService.getAllLeads();
      setLeads(dbLeads);
    } catch (error) {
      console.error('Error cargando leads:', error);
      // Fallback a datos mock si falla
      setLeads(mockLeads);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resto del código igual...
}
```

### 3️⃣ En el Chatbot (src/app/page.tsx)

**DESPUÉS de que el usuario da su email:**
```typescript
const handleSendChatByEmail = async () => {
  // Código existente de envío de email...
  
  // AGREGAR: Guardar lead del chatbot
  try {
    const leadService = LeadService.getInstance();
    await leadService.createLead({
      name: 'Usuario del Chat', // O extraerlo de la conversación
      email: chatEmail,
      source: LeadSource.CHATBOT,
      message: messages.map(m => m.text).join('\n'),
      priority: LeadPriority.HIGH // Chatbot = alta prioridad
    });
  } catch (error) {
    console.log('⚠️ No se pudo guardar lead del chat');
  }
};
```

## 🔧 Configuración de Supabase

### 1. Crear archivo `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2. Ejecutar SQL en Supabase Dashboard:
```sql
-- Ver archivo: src/lib/database/README.md
```

## ✅ Ventajas de esta Implementación

1. **NO ROMPE NADA**: Si Supabase no está configurado, usa mock data
2. **GRADUAL**: Puedes migrar módulo por módulo
3. **PORTABLE**: Fácil cambiar de Supabase a otra BD
4. **TESTEABLE**: MockRepository para tests
5. **PROFESIONAL**: Arquitectura hexagonal estándar

## 🎯 Próximos Pasos

1. **Configurar Supabase** con las credenciales
2. **Crear tabla `leads`** en Supabase
3. **Integrar en el formulario** de contacto primero
4. **Migrar dashboard de leads** para usar BD real
5. **Repetir con otros módulos** (projects, clients, etc.)

## 🆘 Troubleshooting

**"Supabase no está configurado"**
- Verifica que `.env.local` existe
- Reinicia el servidor de Next.js

**"No se ven los leads en el dashboard"**
- Revisa la consola del navegador
- Verifica que la tabla existe en Supabase
- Mira si está usando mock o BD real

**"Error creando lead"**
- Verifica permisos RLS en Supabase
- Revisa que los campos coincidan con la tabla 

# Integration Example: Using Lead Service in Components

## Basic Usage

```typescript
import { LeadService } from '@/lib/services/LeadService';

// In a React component
const MyComponent = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  
  useEffect(() => {
    const fetchLeads = async () => {
      const data = await LeadService.getAll();
      setLeads(data);
    };
    fetchLeads();
  }, []);
  
  // ... rest of component
};
```

## Creating a Lead

```typescript
const handleSubmit = async (formData: any) => {
  try {
    const newLead = await LeadService.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: LeadSource.CONTACT_FORM,
      status: LeadStatus.NEW,
      priority: LeadPriority.MEDIUM
    });
    
    console.log('Lead created:', newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
  }
};
```

## Error Handling

The service automatically falls back to mock data if Supabase is not available, so your app continues working even without database connection.

# Manejo de Secretos en Cloud Build + Next.js

## El Problema

Las variables `NEXT_PUBLIC_*` se **"hornean"** en el código JavaScript durante el build. Esto significa que:
- Cloud Build necesita las variables durante la construcción
- No basta con tenerlas en Cloud Run (es muy tarde)
- El navegador las necesita = deben estar en el bundle compilado

## Solución 1: Variables en Cloud Build Trigger (RECOMENDADA)

### Paso 1: En Google Cloud Console
```
1. Cloud Build > Triggers
2. Editar tu trigger
3. Variables de sustitución:
   - Variable: _SUPABASE_KEY
   - Valor: tu-anon-key-real
```

### Paso 2: cloudbuild.yaml (ya configurado)
```yaml
substitutions:
  _SUPABASE_URL: 'https://tu-proyecto.supabase.co'
  _SUPABASE_KEY: '' # Se sobrescribe desde el trigger
```

## Solución 2: Secret Manager (MÁS SEGURA)

### Paso 1: Crear el secreto
```bash
echo -n "tu-supabase-anon-key" | gcloud secrets create supabase-anon-key --data-file=-
```

### Paso 2: Dar permisos al service account de Cloud Build
```bash
gcloud secrets add-iam-policy-binding supabase-anon-key \
  --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Paso 3: Actualizar cloudbuild.yaml
```yaml
availableSecrets:
  secretManager:
  - versionName: projects/$PROJECT_ID/secrets/supabase-anon-key/versions/latest
    env: 'SUPABASE_KEY'

steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: 
      - 'build'
      - '--build-arg'
      - 'NEXT_PUBLIC_SUPABASE_ANON_KEY=$$SUPABASE_KEY'
      # ...
    secretEnv: ['SUPABASE_KEY']
```

## Solución 3: API Routes (SIN EXPONER KEYS)

En lugar de usar `NEXT_PUBLIC_*`, crear una API route:

```typescript
// app/api/supabase/route.ts
import { createClient } from '@supabase/supabase-js'

// Estas NO son NEXT_PUBLIC, solo están en el servidor
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Usar service key, no anon
)

export async function GET() {
  const { data } = await supabase.from('leads').select('*')
  return Response.json(data)
}
```

Luego en el cliente:
```typescript
// Sin exponer credenciales
const response = await fetch('/api/supabase')
const leads = await response.json()
```

## Comparación de Soluciones

| Método | Seguridad | Complejidad | Cuándo Usar |
|--------|-----------|-------------|-------------|
| Variables en Trigger | ⭐⭐ | Fácil | Proyectos pequeños, keys públicas |
| Secret Manager | ⭐⭐⭐⭐ | Media | Producción, múltiples ambientes |
| API Routes | ⭐⭐⭐⭐⭐ | Alta | Máxima seguridad, keys privadas |
| Hardcodear | ⭐ | Muy fácil | NUNCA en producción |

## Tips Importantes

1. **Anon Key vs Service Key**: 
   - Anon key: OK para exponer (diseñada para eso)
   - Service key: NUNCA exponer (acceso total)

2. **RLS (Row Level Security)**:
   - Siempre activar en Supabase
   - Es tu última línea de defensa

3. **Múltiples Ambientes**:
   - Usar diferentes projects en Supabase
   - Variables diferentes en Cloud Build para staging/prod 