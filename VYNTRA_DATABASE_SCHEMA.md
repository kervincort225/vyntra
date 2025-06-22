# 🏗️ Vyntra - Modelo de Base de Datos Completo

## 📋 **Resumen del Sistema**
Vyntra es una plataforma CRM para gestión de leads, clientes, proyectos y facturación de servicios digitales.

## 🎯 **Entidades Principales**

### 1. **👥 LEADS** ✅ (Ya implementado)
```sql
-- Tabla ya existente
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    message TEXT,
    source VARCHAR(50) NOT NULL, -- 'CONTACT_FORM', 'CHATBOT', 'REFERRAL'
    status VARCHAR(50) NOT NULL, -- 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'
    priority VARCHAR(50) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    estimated_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_to UUID REFERENCES users(id),
    notes TEXT[]
);
```

### 2. **👤 CLIENTS** (Leads convertidos)
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Datos básicos
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    
    -- Datos de empresa
    company_name VARCHAR(255),
    company_type VARCHAR(100), -- 'STARTUP', 'PYME', 'ENTERPRISE', 'FREELANCER'
    industry VARCHAR(100),
    website VARCHAR(255),
    
    -- Dirección
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Chile',
    
    -- Relación con lead original
    lead_id UUID REFERENCES leads(id),
    
    -- Estado del cliente
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    client_type VARCHAR(50) DEFAULT 'REGULAR', -- 'REGULAR', 'VIP', 'ENTERPRISE'
    
    -- Información comercial
    assigned_account_manager UUID REFERENCES users(id),
    acquisition_date DATE DEFAULT CURRENT_DATE,
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos adicionales
    notes TEXT,
    tags VARCHAR(50)[]
);
```

### 3. **👨‍💼 USERS** (Equipo de Vyntra)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos personales
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    
    -- Autenticación
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Perfil profesional
    role VARCHAR(50) NOT NULL, -- 'ADMIN', 'SALES', 'PROJECT_MANAGER', 'DEVELOPER', 'DESIGNER'
    department VARCHAR(100), -- 'SALES', 'DEVELOPMENT', 'DESIGN', 'MANAGEMENT'
    position VARCHAR(100),
    
    -- Configuración
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    permissions JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    
    -- Datos de contacto
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'America/Santiago',
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);
```

### 4. **📁 PROJECTS** (Proyectos por cliente)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos básicos
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Relaciones
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_manager_id UUID REFERENCES users(id),
    
    -- Clasificación
    project_type VARCHAR(100) NOT NULL, -- 'WEB_DEVELOPMENT', 'MOBILE_APP', 'DESIGN', 'MARKETING', 'CONSULTING'
    category VARCHAR(100), -- 'E-COMMERCE', 'CORPORATE', 'LANDING_PAGE', 'SYSTEM'
    
    -- Estado y fechas
    status VARCHAR(50) DEFAULT 'PLANNING', -- 'PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD'
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    
    start_date DATE,
    end_date DATE,
    estimated_completion DATE,
    actual_completion DATE,
    
    -- Información comercial
    budget DECIMAL(12,2) DEFAULT 0,
    estimated_hours INTEGER DEFAULT 0,
    actual_hours INTEGER DEFAULT 0,
    
    -- Progreso
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos adicionales
    notes TEXT,
    tags VARCHAR(50)[],
    
    -- Configuración
    is_billable BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE
);
```

### 5. **📄 DOCUMENTS** (Documentos por proyecto)
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos básicos
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Relaciones
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id),
    uploaded_by UUID REFERENCES users(id),
    
    -- Archivo
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT, -- en bytes
    file_type VARCHAR(100), -- 'PDF', 'DOC', 'IMAGE', 'DESIGN', 'CODE'
    mime_type VARCHAR(100),
    file_path VARCHAR(500), -- ruta en storage
    file_url VARCHAR(500), -- URL pública si aplica
    
    -- Clasificación
    document_type VARCHAR(100) NOT NULL, -- 'CONTRACT', 'PROPOSAL', 'DESIGN', 'DELIVERABLE', 'BRIEF', 'INVOICE'
    category VARCHAR(100),
    
    -- Estado
    status VARCHAR(50) DEFAULT 'DRAFT', -- 'DRAFT', 'REVIEW', 'APPROVED', 'REJECTED', 'FINAL'
    version VARCHAR(20) DEFAULT '1.0',
    
    -- Permisos
    is_public BOOLEAN DEFAULT FALSE,
    requires_signature BOOLEAN DEFAULT FALSE,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos adicionales
    tags VARCHAR(50)[],
    metadata JSONB DEFAULT '{}'
);
```

### 6. **💬 COMMUNICATIONS** (Historial de comunicaciones)
```sql
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relaciones
    client_id UUID REFERENCES clients(id),
    project_id UUID REFERENCES projects(id),
    lead_id UUID REFERENCES leads(id),
    user_id UUID REFERENCES users(id), -- quien envió/recibió
    
    -- Tipo de comunicación
    type VARCHAR(50) NOT NULL, -- 'EMAIL', 'CALL', 'MEETING', 'CHAT', 'SMS', 'WHATSAPP'
    direction VARCHAR(50) NOT NULL, -- 'INBOUND', 'OUTBOUND'
    
    -- Contenido
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Datos específicos por tipo
    email_from VARCHAR(255),
    email_to VARCHAR(255)[],
    email_cc VARCHAR(255)[],
    
    phone_number VARCHAR(20),
    call_duration INTEGER, -- en minutos
    
    meeting_date TIMESTAMP WITH TIME ZONE,
    meeting_duration INTEGER, -- en minutos
    meeting_location VARCHAR(255),
    
    -- Estado
    status VARCHAR(50) DEFAULT 'COMPLETED', -- 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_RESPONSE'
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos adicionales
    attachments JSONB DEFAULT '[]',
    tags VARCHAR(50)[],
    notes TEXT
);
```

### 7. **💰 INVOICES** (Facturación)
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Número de factura
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    
    -- Relaciones
    client_id UUID NOT NULL REFERENCES clients(id),
    project_id UUID REFERENCES projects(id),
    created_by UUID REFERENCES users(id),
    
    -- Fechas
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Montos
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_percentage DECIMAL(5,2) DEFAULT 19, -- IVA Chile
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Estado
    status VARCHAR(50) DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'
    payment_method VARCHAR(50), -- 'TRANSFER', 'CASH', 'CARD', 'PAYPAL'
    
    -- Información adicional
    notes TEXT,
    terms_conditions TEXT,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. **🧾 INVOICE_ITEMS** (Detalles de factura)
```sql
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Producto/Servicio
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Clasificación
    item_type VARCHAR(100), -- 'SERVICE', 'PRODUCT', 'EXPENSE', 'DISCOUNT'
    category VARCHAR(100),
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. **🎯 SERVICES** (Servicios que ofrece Vyntra)
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos básicos
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Clasificación
    category VARCHAR(100) NOT NULL, -- 'DEVELOPMENT', 'DESIGN', 'MARKETING', 'CONSULTING'
    service_type VARCHAR(100), -- 'WEB_DEVELOPMENT', 'MOBILE_APP', 'BRANDING', 'SEO'
    
    -- Precios
    base_price DECIMAL(10,2) DEFAULT 0,
    hourly_rate DECIMAL(8,2) DEFAULT 0,
    pricing_model VARCHAR(50) DEFAULT 'FIXED', -- 'FIXED', 'HOURLY', 'MONTHLY', 'CUSTOM'
    
    -- Configuración
    estimated_duration INTEGER, -- en horas
    is_active BOOLEAN DEFAULT TRUE,
    requires_consultation BOOLEAN DEFAULT FALSE,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos adicionales
    features TEXT[],
    tags VARCHAR(50)[]
);
```

### 10. **📋 TASKS** (Tareas por proyecto)
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos básicos
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Relaciones
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    
    -- Estado y prioridad
    status VARCHAR(50) DEFAULT 'TODO', -- 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED'
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    
    -- Fechas
    start_date DATE,
    due_date DATE,
    completed_date DATE,
    
    -- Tiempo
    estimated_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    
    -- Clasificación
    task_type VARCHAR(100), -- 'DEVELOPMENT', 'DESIGN', 'TESTING', 'MEETING', 'DOCUMENTATION'
    category VARCHAR(100),
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos adicionales
    tags VARCHAR(50)[],
    attachments JSONB DEFAULT '[]'
);
```

## 🔗 **Relaciones Principales**

```
LEADS (1) ←→ (0,1) CLIENTS
CLIENTS (1) ←→ (0,n) PROJECTS  
PROJECTS (1) ←→ (0,n) DOCUMENTS
PROJECTS (1) ←→ (0,n) TASKS
PROJECTS (1) ←→ (0,n) INVOICES
CLIENTS (1) ←→ (0,n) COMMUNICATIONS
USERS (1) ←→ (0,n) LEADS (assigned_to)
USERS (1) ←→ (0,n) PROJECTS (project_manager)
USERS (1) ←→ (0,n) TASKS (assigned_to)
INVOICES (1) ←→ (0,n) INVOICE_ITEMS
```

## 📊 **Diagrama Visual**
```
┌─────────┐    ┌─────────┐    ┌──────────┐
│  LEADS  │───▶│ CLIENTS │───▶│ PROJECTS │
└─────────┘    └─────────┘    └──────────┘
     │              │               │
     ▼              ▼               ▼
┌─────────┐    ┌─────────────┐ ┌──────────┐
│  USERS  │    │COMMUNICATIONS│ │DOCUMENTS │
└─────────┘    └─────────────┘ └──────────┘
     │              │               │
     ▼              ▼               ▼
┌─────────┐    ┌─────────┐    ┌──────────┐
│  TASKS  │    │INVOICES │    │SERVICES  │
└─────────┘    └─────────┘    └──────────┘
                    │
                    ▼
               ┌─────────────┐
               │INVOICE_ITEMS│
               └─────────────┘
```

## 🚀 **Plan de Implementación Incremental**

### **Fase 1: Base** (Semana 1)
1. ✅ LEADS (ya hecho)
2. 🔄 USERS (sistema de usuarios)
3. 🔄 CLIENTS (convertir leads)

### **Fase 2: Gestión** (Semana 2)  
4. 🔄 PROJECTS (proyectos)
5. 🔄 COMMUNICATIONS (historial)
6. 🔄 TASKS (tareas básicas)

### **Fase 3: Documentación** (Semana 3)
7. 🔄 DOCUMENTS (archivos)
8. 🔄 SERVICES (catálogo)

### **Fase 4: Facturación** (Semana 4)
9. 🔄 INVOICES (facturas)
10. 🔄 INVOICE_ITEMS (detalles)

## 🎯 **Próximos Pasos**

**Mañana empezamos con:**
1. **USERS** - Sistema de autenticación y roles
2. **CLIENTS** - Migrar leads convertidos

**Preparación:**
- Crear tablas en Supabase
- Implementar entidades en Domain layer
- Crear repositorios
- Actualizar UI

---

*Este es el modelo completo de Vyntra. Mañana implementamos incremental siguiendo la arquitectura hexagonal que ya tenemos funcionando.* 