// Entidad del dominio - No depende de nada externo
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  message: string;
  value?: number;
  priority: LeadPriority;
  assignedTo?: string;
  lastContact?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadSource {
  CHATBOT = 'chatbot',
  FORM = 'form',
  REFERRAL = 'referral',
  SOCIAL = 'social',
  DIRECT = 'direct'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  CONVERTED = 'converted',
  LOST = 'lost'
}

export enum LeadPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Value Object para crear un nuevo Lead
export interface CreateLeadDTO {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  message: string;
  value?: number;
  priority?: LeadPriority;
}

// Value Object para actualizar un Lead
export interface UpdateLeadDTO {
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedTo?: string;
  notes?: string;
  value?: number;
  lastContact?: Date;
} 